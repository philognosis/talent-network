import type {
  AvailabilityStatus,
  NetworkLink,
  SeniorityLevel,
  Talent,
  Team,
} from "./types";

// Deterministic PRNG so server and client render identical mock data
// (avoids hydration mismatches from Math.random()).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260714);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const pickN = <T,>(arr: readonly T[], n: number) => {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return out;
};

export const HUBS = [
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Sao Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "London", country: "UK", lat: 51.5072, lng: -0.1276 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
] as const;

const DEPARTMENTS = [
  // Tech / Software
  "Engineering",
  "Product",
  "Design",
  "Data & AI",
  "Security",
  "Operations",
  // Finance & Banking
  "Investment Banking",
  "Asset Management",
  "Risk & Compliance",
  "Trading",
  // Healthcare & Life Sciences
  "Clinical Research",
  "Medical Affairs",
  "Health Informatics",
  "Pharmaceutical R&D",
  // Manufacturing & Supply Chain
  "Supply Chain",
  "Quality Assurance",
  "Process Engineering",
  "Procurement",
  // Energy & Sustainability
  "Renewable Energy",
  "Grid Infrastructure",
  "ESG Strategy",
  // Media & Creative
  "Content Strategy",
  "Brand & Marketing",
  "Journalism",
  "Film & Production",
  // Education & Research
  "Curriculum Design",
  "Academic Research",
  "EdTech",
  // Legal & Policy
  "Legal",
  "Public Policy",
  "Regulatory Affairs",
  // Consulting & Strategy
  "Management Consulting",
  "Strategy & Growth",
  "Change Management",
  // Logistics & Transport
  "Logistics",
  "Urban Mobility",
  "Aviation",
  // Real Estate & Construction
  "Architecture",
  "Real Estate Development",
  "Construction Management",
] as const;

const TEAM_NAMES_BY_DEPT: Record<string, string[]> = {
  Engineering: ["Platform", "Infrastructure", "Core Services", "Mobile"],
  Product: ["Growth", "Core Product", "Platform Product"],
  Design: ["Product Design", "Design Systems"],
  "Data & AI": ["Applied AI", "Data Platform", "ML Research"],
  Security: ["AppSec", "Detection & Response"],
  Operations: ["People Ops", "Revenue Ops"],
  "Investment Banking": ["M&A Advisory", "Capital Markets", "Restructuring"],
  "Asset Management": ["Equity", "Fixed Income", "Alternatives"],
  "Risk & Compliance": ["Credit Risk", "Market Risk", "AML"],
  Trading: ["Equities", "FX & Rates", "Commodities"],
  "Clinical Research": ["Phase II/III Trials", "Biostatistics", "Regulatory Submissions"],
  "Medical Affairs": ["Medical Science Liaison", "Health Economics"],
  "Health Informatics": ["EHR Systems", "Population Health"],
  "Pharmaceutical R&D": ["Drug Discovery", "Formulation", "Preclinical"],
  "Supply Chain": ["Demand Planning", "Inventory Management", "Last-Mile"],
  "Quality Assurance": ["QA Engineering", "Compliance & Audit"],
  "Process Engineering": ["Lean Manufacturing", "Automation"],
  Procurement: ["Strategic Sourcing", "Vendor Management"],
  "Renewable Energy": ["Solar Development", "Wind Operations", "Storage Solutions"],
  "Grid Infrastructure": ["Transmission", "Smart Grid", "Control Systems"],
  "ESG Strategy": ["Carbon Accounting", "Sustainability Reporting"],
  "Content Strategy": ["Editorial", "Social Media", "SEO & Growth"],
  "Brand & Marketing": ["Performance Marketing", "Brand Identity"],
  Journalism: ["Investigative", "Data Journalism", "Video"],
  "Film & Production": ["Direction", "Post Production", "VFX"],
  "Curriculum Design": ["K-12", "Higher Education", "Corporate L&D"],
  "Academic Research": ["Neuroscience", "Social Sciences", "Materials Science"],
  EdTech: ["Learning Platforms", "Assessment Tools"],
  Legal: ["Corporate Law", "IP & Patents", "Litigation"],
  "Public Policy": ["Legislative Affairs", "International Relations"],
  "Regulatory Affairs": ["FDA Submissions", "EMA Compliance", "Market Access"],
  "Management Consulting": ["Strategy", "Digital Transformation", "Operations"],
  "Strategy & Growth": ["Venture Development", "Market Expansion"],
  "Change Management": ["Organizational Design", "Culture & Engagement"],
  Logistics: ["Freight Operations", "Route Optimization", "Cold Chain"],
  "Urban Mobility": ["Micromobility", "Public Transit", "EV Infrastructure"],
  Aviation: ["Flight Operations", "MRO", "Airport Management"],
  Architecture: ["Urban Design", "Interior Architecture", "BIM"],
  "Real Estate Development": ["Commercial", "Residential", "Mixed-Use"],
  "Construction Management": ["Project Management", "Civil Engineering", "Safety"],
};

const SKILLS = [
  // Tech
  "TypeScript", "Python", "Rust", "Go", "React", "Kubernetes", "LLM Agents",
  "Distributed Systems", "UX Research", "Figma", "Data Modeling", "MLOps",
  "Security Engineering", "Product Strategy", "SQL", "Terraform", "GraphQL",
  "iOS", "Android", "Prompt Engineering",
  // Finance
  "Financial Modeling", "Valuation", "Bloomberg Terminal", "Risk Management",
  "Portfolio Management", "Credit Analysis", "Derivatives", "M&A Execution",
  "Fixed Income", "Regulatory Reporting",
  // Healthcare & Life Sciences
  "Clinical Trial Design", "Biostatistics", "FDA Regulatory", "Pharmacovigilance",
  "EHR/EMR Systems", "Health Economics", "GCP Compliance", "Drug Development",
  // Manufacturing & Supply Chain
  "Lean Six Sigma", "SAP ERP", "Demand Forecasting", "Procurement Strategy",
  "Quality Management Systems", "Automation & Robotics", "ISO Standards",
  // Energy
  "Grid Modeling", "SCADA Systems", "Carbon Accounting", "Energy Storage",
  "Solar PV Design", "Wind Resource Assessment", "ESG Reporting",
  // Media & Creative
  "Content Strategy", "Video Production", "Adobe Creative Suite", "SEO",
  "Brand Strategy", "Social Media", "Investigative Journalism",
  // Education & Research
  "Curriculum Development", "Instructional Design", "Academic Writing",
  "Research Methodology", "Grant Writing", "Neuroscience",
  // Legal & Policy
  "Contract Negotiation", "Intellectual Property", "Litigation", "Compliance",
  "Policy Analysis", "Regulatory Strategy", "International Law",
  // Consulting & Strategy
  "Strategic Planning", "Change Management", "Stakeholder Engagement",
  "Business Development", "Workshop Facilitation", "Digital Transformation",
  // Logistics & Transport
  "Route Optimization", "Fleet Management", "Cold Chain Logistics",
  "Air Traffic Control", "Supply Chain Analytics",
  // Real Estate & Construction
  "BIM/Revit", "Project Management", "Civil Engineering", "Urban Planning",
  "Real Estate Finance", "Construction Safety", "AutoCAD",
] as const;

const ROLE_TITLE_BY_DEPT: Record<string, string> = {
  Engineering: "Engineer",
  Product: "Manager",
  Design: "Designer",
  "Data & AI": "Analyst",
  Security: "Engineer",
  Operations: "Specialist",
  "Investment Banking": "Analyst",
  "Asset Management": "Manager",
  "Risk & Compliance": "Officer",
  Trading: "Trader",
  "Clinical Research": "Scientist",
  "Medical Affairs": "Specialist",
  "Health Informatics": "Analyst",
  "Pharmaceutical R&D": "Researcher",
  "Supply Chain": "Manager",
  "Quality Assurance": "Engineer",
  "Process Engineering": "Engineer",
  Procurement: "Manager",
  "Renewable Energy": "Engineer",
  "Grid Infrastructure": "Engineer",
  "ESG Strategy": "Consultant",
  "Content Strategy": "Strategist",
  "Brand & Marketing": "Manager",
  Journalism: "Journalist",
  "Film & Production": "Producer",
  "Curriculum Design": "Designer",
  "Academic Research": "Researcher",
  EdTech: "Specialist",
  Legal: "Counsel",
  "Public Policy": "Advisor",
  "Regulatory Affairs": "Specialist",
  "Management Consulting": "Consultant",
  "Strategy & Growth": "Strategist",
  "Change Management": "Consultant",
  Logistics: "Coordinator",
  "Urban Mobility": "Planner",
  Aviation: "Manager",
  Architecture: "Architect",
  "Real Estate Development": "Manager",
  "Construction Management": "Manager",
};

const SENIORITY: SeniorityLevel[] = ["junior", "mid", "senior", "staff", "lead"];
const AVAILABILITY: AvailabilityStatus[] = [
  "available",
  "available",
  "engaged",
  "engaged",
  "engaged",
  "not-available",
];

const FIRST_NAMES = [
  "Amara", "Liam", "Sofia", "Kenji", "Priya", "Noah", "Fatima", "Lucas",
  "Wei", "Emma", "Diego", "Hana", "Oliver", "Aisha", "Mateus", "Zara",
  "Ethan", "Ingrid", "Rahul", "Chloe", "Kwame", "Mei", "Santiago", "Nadia",
  "Felix", "Aiko", "Omar", "Grace", "Viktor", "Leila",
];
const LAST_NAMES = [
  "Okafor", "Nakamura", "Silva", "Kowalski", "Sharma", "Andersen", "Costa",
  "Chen", "Muller", "Diallo", "Nguyen", "Rossi", "Kim", "Haddad", "Petrov",
  "Osei", "Fernandes", "Larsen", "Ibrahim", "Tanaka",
];

function makeName() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return {
    name: `${first} ${last}`,
    initials: `${first[0]}${last[0]}`,
  };
}

function jitter(value: number, spread: number) {
  return value + (rand() - 0.5) * spread;
}

const TALENT_COUNT = 420;

export const talents: Talent[] = Array.from({ length: TALENT_COUNT }, (_, i) => {
  const hub = pick(HUBS);
  const department = pick(DEPARTMENTS);
  const team = pick(TEAM_NAMES_BY_DEPT[department]);
  const { name, initials } = makeName();
  const seniority = pick(SENIORITY);
  const years =
    seniority === "junior"
      ? Math.floor(1 + rand() * 2)
      : seniority === "mid"
        ? Math.floor(3 + rand() * 3)
        : seniority === "senior"
          ? Math.floor(6 + rand() * 4)
          : Math.floor(9 + rand() * 8);

  const roleTitle = ROLE_TITLE_BY_DEPT[department] ?? "Specialist";
  const seniorityLabel = seniority === "lead" ? "Lead" : seniority[0].toUpperCase() + seniority.slice(1);

  return {
    id: `t-${i.toString().padStart(4, "0")}`,
    name,
    initials,
    role: `${seniorityLabel} ${team} ${roleTitle}`,
    team: `${team}`,
    department,
    location: {
      city: hub.city,
      country: hub.country,
      // small jitter so people in the same city don't perfectly overlap
      lat: jitter(hub.lat, 0.6),
      lng: jitter(hub.lng, 0.6),
    },
    skills: pickN(SKILLS, 2 + Math.floor(rand() * 3)),
    seniority,
    availability: pick(AVAILABILITY),
    yearsExperience: years,
    managerId: null,
  };
});

// Assign lightweight reporting lines: leads/staff "manage" a few juniors/mids in the same team+hub.
const leadsByTeam = new Map<string, Talent[]>();
for (const t of talents) {
  const key = `${t.department}:${t.team}`;
  if (t.seniority === "lead" || t.seniority === "staff") {
    if (!leadsByTeam.has(key)) leadsByTeam.set(key, []);
    leadsByTeam.get(key)!.push(t);
  }
}
for (const t of talents) {
  if (t.seniority === "lead" || t.seniority === "staff") continue;
  const key = `${t.department}:${t.team}`;
  const candidates = leadsByTeam.get(key);
  if (candidates && candidates.length) {
    t.managerId = pick(candidates).id;
  }
}

export const teams: Team[] = (() => {
  const map = new Map<string, Team>();
  const teamColors = [
    "#4FD8FF", "#9B8CFF", "#FFB454", "#5EEAD4", "#FF8FA3", "#8FD694",
  ];
  let colorIdx = 0;
  for (const t of talents) {
    const key = `${t.department}:${t.team}`;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: t.team,
        department: t.department,
        color: teamColors[colorIdx % teamColors.length],
        memberIds: [],
      });
      colorIdx++;
    }
    map.get(key)!.memberIds.push(t.id);
  }
  return Array.from(map.values());
})();

// Network links: reporting lines + cross-hub collaboration edges within the same team,
// plus a handful of cross-team "network" edges to make the global graph feel alive.
export const networkLinks: NetworkLink[] = [];
let linkId = 0;

for (const t of talents) {
  if (t.managerId) {
    networkLinks.push({
      id: `l-${linkId++}`,
      sourceId: t.id,
      targetId: t.managerId,
      strength: 0.8,
      kind: "reporting",
    });
  }
}

for (const team of teams) {
  const members = team.memberIds;
  const edgeCount = Math.min(members.length, 6);
  for (let i = 0; i < edgeCount; i++) {
    const a = pick(members);
    const b = pick(members);
    if (a !== b) {
      networkLinks.push({
        id: `l-${linkId++}`,
        sourceId: a,
        targetId: b,
        strength: 0.4 + rand() * 0.4,
        kind: "collaboration",
      });
    }
  }
}

// Cross-region mentorship / cross-functional links for global network texture
for (let i = 0; i < 70; i++) {
  const a = pick(talents);
  const b = pick(talents);
  if (a.id !== b.id) {
    networkLinks.push({
      id: `l-${linkId++}`,
      sourceId: a.id,
      targetId: b.id,
      strength: 0.2 + rand() * 0.3,
      kind: "mentorship",
    });
  }
}

export const ALL_SKILLS = SKILLS;
export const ALL_TEAMS = teams;
export const ALL_DEPARTMENTS = DEPARTMENTS;

export function talentById(id: string): Talent | undefined {
  return talents.find((t) => t.id === id);
}
