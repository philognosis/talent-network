"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapGL, { NavigationControl, useControl, type MapRef } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ArcLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import type { PickingInfo } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";

import type { NetworkLink, Talent } from "@/lib/types";
import { useTalentClusters, type ClusterOrTalent } from "@/hooks/useTalentClusters";

// Free, no-API-key vector basemap (CARTO dark matter) — attribution included via the map's built-in control.
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

const INITIAL_VIEW = {
  longitude: 12,
  latitude: 22,
  zoom: 1.6,
};

interface MapCanvasProps {
  talents: Talent[];
  links: NetworkLink[];
  selectedTalentId: string | null;
  onSelectTalent: (id: string | null) => void;
  showNetwork: boolean;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
  onBoundsChange?: (bounds: { west: number; south: number; east: number; north: number }) => void;
}

function DeckOverlay(props: {
  layers: unknown[];
  onClick: (info: PickingInfo) => void;
  onHover: (info: PickingInfo) => void;
}) {
  const overlay = useControl<MapboxOverlay>(
    () =>
      new MapboxOverlay({
        interleaved: false,
        layers: props.layers as never,
        onClick: props.onClick,
        onHover: props.onHover,
        getCursor: ({ isHovering }) => (isHovering ? "pointer" : "grab"),
      }),
  );
  overlay.setProps({ layers: props.layers as never, onClick: props.onClick, onHover: props.onHover });
  return null;
}

export default function MapCanvas({
  talents,
  links,
  selectedTalentId,
  onSelectTalent,
  showNetwork,
  flyToTarget,
  onBoundsChange,
}: MapCanvasProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEW);
  const [bounds, setBounds] = useState<{ west: number; south: number; east: number; north: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // rAF-driven pulse tick powers the "traveling energy" look on network arcs
  useEffect(() => {
    let raf: number;
    const loop = (t: number) => {
      setTick(t / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateFromMap = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const b = map.getBounds();
    const next = { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() };
    setBounds(next);
    onBoundsChange?.(next);
    const c = map.getCenter();
    setViewport({ longitude: c.lng, latitude: c.lat, zoom: map.getZoom() });
  }, [onBoundsChange]);

  useEffect(() => {
    if (flyToTarget) {
      mapRef.current?.flyTo({
        center: [flyToTarget.lng, flyToTarget.lat],
        zoom: flyToTarget.zoom ?? 6,
        duration: 1200,
        essential: true,
      });
    }
  }, [flyToTarget]);

  const { points, getExpansionZoom } = useTalentClusters(talents, bounds, viewport.zoom);

  const talentIdSet = useMemo(() => new Set(talents.map((t) => t.id)), [talents]);
  const talentByIdMap = useMemo(
    () => new Map<string, Talent>(talents.map((t): [string, Talent] => [t.id, t])),
    [talents],
  );

  const visibleLinks = useMemo(() => {
    if (!showNetwork) return [];
    const filtered = links.filter(
      (l) => talentIdSet.has(l.sourceId) && talentIdSet.has(l.targetId),
    );
    const capped = selectedTalentId
      ? filtered.filter((l) => l.sourceId === selectedTalentId || l.targetId === selectedTalentId)
      : filtered.slice(0, 220);
    return capped;
  }, [links, talentIdSet, showNetwork, selectedTalentId]);

  const arcLayer = new ArcLayer<NetworkLink>({
    id: "network-arcs",
    data: visibleLinks,
    pickable: false,
    getSourcePosition: (l) => {
      const t = talentByIdMap.get(l.sourceId);
      return t ? [t.location.lng, t.location.lat] : [0, 0];
    },
    getTargetPosition: (l) => {
      const t = talentByIdMap.get(l.targetId);
      return t ? [t.location.lng, t.location.lat] : [0, 0];
    },
    getSourceColor: [79, 216, 255, 90],
    getTargetColor: (l, ctx) => {
      const phase = (tick * 0.6 + (ctx.index ?? 0) * 0.13) % 1;
      const glow = Math.max(0, 1 - Math.abs(phase - 0.5) * 2);
      return [155, 140, 255, 60 + glow * 140];
    },
    getHeight: 0.15,
    getWidth: (l) => 0.6 + l.strength * 1.6,
    greatCircle: true,
    updateTriggers: {
      getTargetColor: [tick],
    },
  });

  type ClusterPt = Extract<ClusterOrTalent, { type: "cluster" }>;
  type TalentPt = Extract<ClusterOrTalent, { type: "talent" }>;

  const clusterLayer = new ScatterplotLayer<ClusterPt>({
    id: "clusters",
    data: points.filter((p): p is ClusterPt => p.type === "cluster"),
    pickable: true,
    getPosition: (d) => [d.lng, d.lat],
    getRadius: (d) => 14 + Math.min(Math.sqrt(d.count) * 5, 40),
    radiusUnits: "pixels",
    getFillColor: (d) => {
      const hex = d.leadTeamColor;
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 130];
    },
    getLineColor: (d) => {
      const hex = d.leadTeamColor;
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255];
    },
    lineWidthUnits: "pixels",
    getLineWidth: 1.5,
    stroked: true,
  });

  const clusterLabelLayer = new TextLayer<ClusterPt>({
    id: "cluster-labels",
    data: points.filter((p): p is ClusterPt => p.type === "cluster"),
    pickable: false,
    getPosition: (d) => [d.lng, d.lat],
    getText: (d) => String(d.count),
    getSize: 12,
    fontFamily: "var(--font-data), monospace",
    fontWeight: 600,
    getColor: [231, 236, 243, 255],
  });

  const talentDotLayer = new ScatterplotLayer<TalentPt>({
    id: "talent-dots",
    data: points.filter((p): p is TalentPt => p.type === "talent"),
    pickable: true,
    getPosition: (d) => [d.lng, d.lat],
    getRadius: (d) => (d.id === selectedTalentId ? 9 : d.id === hoverId ? 8 : 6),
    radiusUnits: "pixels",
    getFillColor: (d) =>
      d.id === selectedTalentId
        ? [255, 180, 84, 255]
        : d.talent.availability === "available"
          ? [79, 216, 255, 220]
          : [138, 147, 166, 190],
    getLineColor: [7, 10, 16, 255],
    lineWidthUnits: "pixels",
    getLineWidth: 1.5,
    stroked: true,
    updateTriggers: {
      getRadius: [selectedTalentId, hoverId],
      getFillColor: [selectedTalentId],
    },
  });

  const handleClick = useCallback(
    (info: PickingInfo) => {
      const obj = info.object as ClusterOrTalent | undefined;
      if (!obj) {
        onSelectTalent(null);
        return;
      }
      if (obj.type === "talent") {
        onSelectTalent(obj.id);
      } else if (obj.type === "cluster") {
        const targetZoom = Math.min(getExpansionZoom(obj.id), 16);
        mapRef.current?.flyTo({
          center: [obj.lng, obj.lat],
          zoom: targetZoom,
          duration: 700,
          essential: true,
        });
      }
    },
    [onSelectTalent, getExpansionZoom],
  );

  const handleHover = useCallback((info: PickingInfo) => {
    const obj = info.object as ClusterOrTalent | undefined;
    setHoverId(obj?.type === "talent" ? obj.id : null);
  }, []);

  return (
    <div className="absolute inset-0">
      <MapGL
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        mapStyle={MAP_STYLE}
        onLoad={updateFromMap}
        onMoveEnd={updateFromMap}
        onMove={(evt) => setViewport(evt.viewState)}
        attributionControl={{ compact: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        <DeckOverlay
          layers={[arcLayer, clusterLayer, talentDotLayer, clusterLabelLayer]}
          onClick={handleClick}
          onHover={handleHover}
        />
      </MapGL>
    </div>
  );
}
