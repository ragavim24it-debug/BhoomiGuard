/**
 * BHOOMIGUARD — Citizen Portal shared data helpers.
 *
 * All land facts come from the connected database (clearly labelled demo data).
 * Nothing in this file exposes internal officer analysis (risk score, priority
 * score, evidence-conflict intelligence, AI analysis or officer remarks).
 */

export const CITIZEN_DEMO_LABEL = "DEMO DATA — NOT A GOVERNMENT RECORD";

export type CitizenStatus = "VERIFIED" | "PENDING" | "ATTENTION REQUIRED";

export interface LandParcel {
  id: string;
  survey_number: string;
  sub_division: string;
  patta_number: string;
  district: string;
  taluk: string;
  village: string;
  classification: string;
  government_area: number;
  surveyed_area: number | null;
  boundary_displacement: number | null;
  verification_status: string;
  boundary_status: string;
  latest_survey_date: string | null;
  source: string;
  latitude: number;
  longitude: number;
  boundary_geometry: unknown | null;
  drone_survey_date: string | null;
  drone_survey_status: string | null;
  drone_surveyed_area: number | null;
  rtk_survey_date: string | null;
  rtk_status: string | null;
  rtk_public_accuracy: string | null;
  is_demo: boolean;
  last_updated: string;
}

export interface LandSurvey {
  id: string;
  land_id: string;
  survey_date: string;
  survey_type: string;
  surveyed_area: number | null;
  boundary_movement: number | null;
  verification_status: string;
  boundary_status: string;
  public_result: string;
  is_demo: boolean;
}

export interface LandDocument {
  id: string;
  land_id: string;
  title: string;
  document_type: string;
  issued_on: string | null;
  reference: string | null;
  file_path: string | null;
  uploaded_by: string | null;
  is_demo: boolean;
}

export interface CitizenRequest {
  id: string;
  citizen_id: string;
  land_id: string;
  request_code: string;
  request_type: string;
  issue_type: string | null;
  reason: string;
  photo_path: string | null;
  document_path: string | null;
  status: string;
  latest_update: string;
  created_at: string;
  updated_at: string;
}

export interface CitizenNotification {
  id: string;
  land_id: string | null;
  category: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CitizenProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  village: string | null;
}

export const ISSUE_TYPES = [
  "Area mismatch",
  "Boundary encroachment",
  "Wrong land classification",
  "Incorrect owner / patta details",
  "Survey not done",
  "Other",
] as const;

export const REQUEST_FLOW: Record<string, string[]> = {
  "Report Issue": ["Submitted", "Officer Assigned", "Field Verification", "Resolved"],
  "Re-verification": ["Pending", "Officer Review", "Field Verification", "Completed"],
};

export const formatAcres = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : `${Number(value).toFixed(2)} acres`;

export const formatMetres = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : `${Number(value).toFixed(2)} m`;

export const formatDate = (value: string | null | undefined) =>
  !value ? "—" : new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDateTime = (value: string) => new Date(value).toLocaleString("en-IN");

export function getAreaComparison(land: LandParcel) {
  const gov = Number(land.government_area);
  const surveyed = land.surveyed_area === null ? null : Number(land.surveyed_area);
  if (surveyed === null) return { gov, surveyed: null, difference: null, percent: null };
  const difference = Math.abs(gov - surveyed);
  return { gov, surveyed, difference, percent: gov === 0 ? null : (difference / gov) * 100 };
}

const areaStatus = (percent: number | null): CitizenStatus =>
  percent === null ? "PENDING" : percent <= 2 ? "VERIFIED" : percent <= 5 ? "PENDING" : "ATTENTION REQUIRED";

const mapStatus = (raw: string): CitizenStatus => {
  const value = raw.toLowerCase();
  if (value.includes("verified")) return value.includes("required") ? "ATTENTION REQUIRED" : "VERIFIED";
  if (value.includes("attention") || value.includes("required")) return "ATTENTION REQUIRED";
  return "PENDING";
};

const rank: Record<CitizenStatus, number> = { VERIFIED: 0, PENDING: 1, "ATTENTION REQUIRED": 2 };

export interface LandHealth {
  area: CitizenStatus;
  boundary: CitizenStatus;
  verification: CitizenStatus;
  latestSurvey: string;
  overall: CitizenStatus;
}

export function getLandHealth(land: LandParcel): LandHealth {
  const { percent } = getAreaComparison(land);
  const area = areaStatus(percent);
  const boundary = mapStatus(land.boundary_status);
  const verification = mapStatus(land.verification_status);
  const overall = [area, boundary, verification].reduce<CitizenStatus>(
    (worst, current) => (rank[current] > rank[worst] ? current : worst),
    "VERIFIED",
  );
  return { area, boundary, verification, latestSurvey: formatDate(land.latest_survey_date), overall };
}

/** Citizen-friendly explanation built from the land's own database values. */
export function explainMyLand(land: LandParcel): string[] {
  const { gov, surveyed, difference, percent } = getAreaComparison(land);
  const lines: string[] = [];

  if (surveyed === null) {
    lines.push(
      `Your government record shows ${gov.toFixed(2)} acres for Survey No. ${land.survey_number}. A fresh survey has not been recorded yet, so no comparison can be shown.`,
    );
  } else if (difference !== null && difference < 0.01) {
    lines.push(
      `Your government record shows ${gov.toFixed(2)} acres and the latest survey also shows ${surveyed.toFixed(2)} acres. The two match.`,
    );
  } else {
    lines.push(
      `Your government record shows ${gov.toFixed(2)} acres, while the latest survey shows ${surveyed!.toFixed(2)} acres. A difference of ${difference!.toFixed(2)} acres${percent === null ? "" : ` (${percent.toFixed(2)}%)`} was observed.`,
    );
  }

  if (land.boundary_displacement !== null) {
    lines.push(
      `The boundary of your land was measured about ${Number(land.boundary_displacement).toFixed(2)} metres away from its recorded position.`,
    );
  }

  lines.push(
    mapStatus(land.boundary_status) === "VERIFIED"
      ? "Boundary verification is complete for this land."
      : "Boundary verification is required for this land.",
  );

  if (land.latest_survey_date) {
    lines.push(`The most recent survey of this land was carried out on ${formatDate(land.latest_survey_date)}.`);
  }

  lines.push(
    mapStatus(land.verification_status) === "ATTENTION REQUIRED"
      ? "You may request a re-verification or report an issue from this portal. This information is for your awareness only and is not a legal decision about ownership."
      : "No action is needed from you right now. This information is for your awareness only and is not a legal decision about ownership.",
  );

  return lines;
}

export function publicSummary(land: LandParcel): string {
  const { difference, percent } = getAreaComparison(land);
  if (difference === null) return "Survey pending. Government recorded area is shown for reference.";
  if (difference < 0.01) return "Latest survey matches the government recorded area. Boundary confirmed.";
  return `Latest survey is ${difference.toFixed(2)} acres${percent === null ? "" : ` (${percent.toFixed(2)}%)`} lower than the government record. Boundary verification is required.`;
}
