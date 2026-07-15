"use client";

import { useMemo } from "react";
import Supercluster from "supercluster";
import type { Talent } from "@/lib/types";

export interface ClusterPoint {
  type: "cluster";
  id: number;
  lng: number;
  lat: number;
  count: number;
  leadTeamColor: string;
}

export interface TalentPoint {
  type: "talent";
  id: string;
  lng: number;
  lat: number;
  talent: Talent;
}

export type ClusterOrTalent = ClusterPoint | TalentPoint;

interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

const teamColor = (team: string) => {
  // stable pseudo-color per team name so clusters feel consistent
  let hash = 0;
  for (let i = 0; i < team.length; i++) hash = (hash * 31 + team.charCodeAt(i)) | 0;
  const palette = ["#4FD8FF", "#9B8CFF", "#FFB454", "#5EEAD4", "#FF8FA3", "#8FD694"];
  return palette[Math.abs(hash) % palette.length];
};

export interface UseTalentClustersResult {
  points: ClusterOrTalent[];
  getExpansionZoom: (clusterId: number) => number;
}

export function useTalentClusters(
  talents: Talent[],
  bounds: Bounds | null,
  zoom: number,
): UseTalentClustersResult {
  const index = useMemo(() => {
    const sc = new Supercluster<{ talentId: string; team: string }>({
      radius: 56,
      maxZoom: 14,
      minPoints: 3,
    });
    sc.load(
      talents.map((t) => ({
        type: "Feature",
        properties: { talentId: t.id, team: t.team },
        geometry: { type: "Point", coordinates: [t.location.lng, t.location.lat] },
      })),
    );
    return sc;
  }, [talents]);

  const talentLookup = useMemo(() => {
    const map = new Map<string, Talent>();
    for (const t of talents) map.set(t.id, t);
    return map;
  }, [talents]);

  const points = useMemo(() => {
    if (!bounds) return [];
    const bbox: [number, number, number, number] = [
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    ];
    const z = Math.round(Math.min(Math.max(zoom, 0), 20));
    const clusters = index.getClusters(bbox, z);

    return clusters.map((f): ClusterOrTalent => {
      const [lng, lat] = f.geometry.coordinates as [number, number];
      const props = f.properties;
      if ("cluster" in props && props.cluster) {
        const leaves = index.getLeaves(props.cluster_id, 1);
        const leadTeam = (leaves[0]?.properties as { team?: string } | undefined)?.team ?? "";
        return {
          type: "cluster",
          id: props.cluster_id,
          lng,
          lat,
          count: props.point_count,
          leadTeamColor: teamColor(leadTeam),
        };
      }
      const talent = talentLookup.get(props.talentId)!;
      return { type: "talent", id: talent.id, lng, lat, talent };
    });
  }, [index, bounds, zoom, talentLookup]);

  const getExpansionZoom = (clusterId: number) => index.getClusterExpansionZoom(clusterId);

  return { points, getExpansionZoom };
}
