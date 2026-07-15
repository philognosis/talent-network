export type SeniorityLevel = "junior" | "mid" | "senior" | "staff" | "lead";

export type AvailabilityStatus = "available" | "engaged" | "not-available";

export interface Talent {
  id: string;
  name: string;
  initials: string;
  role: string;
  team: string;
  department: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  skills: string[];
  seniority: SeniorityLevel;
  availability: AvailabilityStatus;
  yearsExperience: number;
  managerId: string | null;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  color: string;
  memberIds: string[];
}

export interface NetworkLink {
  id: string;
  sourceId: string;
  targetId: string;
  /** relationship strength drives arc thickness, 0-1 */
  strength: number;
  kind: "collaboration" | "reporting" | "mentorship";
}

export interface MapBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface TalentFilters {
  query: string;
  teams: string[];
  skills: string[];
  seniority: SeniorityLevel[];
  availability: AvailabilityStatus[];
}
