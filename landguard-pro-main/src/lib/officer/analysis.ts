/**
 * Derived analysis for the shared land-record model.
 * Every module in the Officer Portal reads these helpers — no module-specific dummy data.
 * All outputs are indicators only; they make no legal ownership or dispute determination.
 */
import type { EvidenceState, LandRecord } from "./data";

export interface Discrepancy {
  hasData: boolean;
  difference: number | null; // acres
  differencePercent: number | null;
  boundaryDisplacement: number | null;
  status: "Within Tolerance" | "Minor Discrepancy" | "Significant Discrepancy" | "Data Unavailable";
}

export function getDiscrepancy(record: LandRecord): Discrepancy {
  if (record.surveyedArea === null) {
    return {
      hasData: false,
      difference: null,
      differencePercent: null,
      boundaryDisplacement: record.boundaryDisplacement,
      status: "Data Unavailable",
    };
  }
  const difference = record.governmentArea - record.surveyedArea;
  const differencePercent = (Math.abs(difference) / record.governmentArea) * 100;
  const displacement = record.boundaryDisplacement ?? 0;
  const status =
    differencePercent >= 5 || displacement >= 1.5
      ? "Significant Discrepancy"
      : differencePercent >= 2 || displacement >= 0.75
        ? "Minor Discrepancy"
        : "Within Tolerance";
  return {
    hasData: true,
    difference,
    differencePercent,
    boundaryDisplacement: record.boundaryDisplacement,
    status,
  };
}

export interface EvidenceRow {
  source: string;
  state: EvidenceState;
  observed: string;
  note: string;
}

export interface EvidenceAnalysis {
  rows: EvidenceRow[];
  matches: number;
  conflicts: number;
  unavailable: number;
  confidence: number;
  supporting: string[];
  conflicting: string[];
  explanation: string;
}

export function getEvidenceAnalysis(record: LandRecord): EvidenceAnalysis {
  const gov = record.governmentArea;
  const tolerance = gov * 0.02;
  const rows: EvidenceRow[] = [
    {
      source: "Government Record",
      state: "MATCH",
      observed: `${gov.toFixed(2)} acres`,
      note: "Baseline record of rights used for comparison.",
    },
    record.droneSurvey && record.surveyedArea !== null
      ? {
          source: "Drone Survey",
          state: Math.abs(gov - record.surveyedArea) > tolerance ? "CONFLICT" : "MATCH",
          observed: `${record.surveyedArea.toFixed(2)} acres`,
          note: `Orthomosaic ${record.droneSurvey.gsd}, ${record.droneSurvey.coverage}.`,
        }
      : { source: "Drone Survey", state: "UNAVAILABLE", observed: "—", note: "No drone survey attached." },
    record.rtk
      ? {
          source: "RTK / GNSS",
          state: record.rtk.confidence >= 90 ? "MATCH" : "CONFLICT",
          observed: `${record.rtk.fixType}, ${record.rtk.points} pts`,
          note: `Receiver confidence ${record.rtk.confidence}%.`,
        }
      : { source: "RTK / GNSS", state: "UNAVAILABLE", observed: "—", note: "No RTK observation attached." },
    record.gisRecordArea !== null
      ? {
          source: "GIS Record",
          state: Math.abs(gov - record.gisRecordArea) > tolerance ? "CONFLICT" : "MATCH",
          observed: `${record.gisRecordArea.toFixed(2)} acres`,
          note: "Area computed from connected GIS layer.",
        }
      : { source: "GIS Record", state: "UNAVAILABLE", observed: "—", note: "No GIS layer connected." },
    record.historicalBoundary.length > 0
      ? {
          source: "Historical Data",
          state: (record.boundaryDisplacement ?? 0) >= 2 ? "CONFLICT" : "MATCH",
          observed: `${record.historicalBoundary.length} epochs`,
          note: "Historical boundary displacement series available.",
        }
      : { source: "Historical Data", state: "UNAVAILABLE", observed: "—", note: "No historical series available." },
  ];

  const matches = rows.filter((r) => r.state === "MATCH").length;
  const conflicts = rows.filter((r) => r.state === "CONFLICT").length;
  const unavailable = rows.filter((r) => r.state === "UNAVAILABLE").length;
  const confidence = Math.max(0, Math.min(100, 100 - conflicts * 15 - unavailable * 5));
  const supporting = rows.filter((r) => r.state === "MATCH").map((r) => r.source);
  const conflicting = rows.filter((r) => r.state === "CONFLICT").map((r) => r.source);
  const explanation = conflicts
    ? `${conflicting.join(", ")} disagree${conflicting.length === 1 ? "s" : ""} with the government record beyond the 2% area tolerance. Field verification is recommended before any conclusion.`
    : unavailable >= 3
      ? "Too few independent sources are connected to confirm the record. Attach drone, RTK or GIS evidence."
      : "All connected evidence sources agree with the government record within tolerance.";

  return { rows, matches, conflicts, unavailable, confidence, supporting, conflicting, explanation };
}

export interface ConfidenceFactor {
  label: string;
  score: number;
  weight: number;
  detail: string;
}

export interface ConfidenceResult {
  score: number;
  factors: ConfidenceFactor[];
  level: "High" | "Moderate" | "Low";
}

export function getConfidence(record: LandRecord): ConfidenceResult {
  const disc = getDiscrepancy(record);
  const evidence = getEvidenceAnalysis(record);

  const areaScore = disc.differencePercent === null ? 0 : Math.max(0, 100 - disc.differencePercent * 3);
  const boundaryScore =
    record.boundaryDisplacement === null ? 0 : Math.max(0, 100 - record.boundaryDisplacement * 20);
  const rtkScore = record.rtk ? record.rtk.confidence : 0;
  const evidenceScore = evidence.confidence;
  const monthsOld = (Date.now() - new Date(record.lastUpdated).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  const freshnessScore = Math.max(0, Math.min(100, 100 - Math.max(0, monthsOld - 12) * 4));

  const factors: ConfidenceFactor[] = [
    {
      label: "Area consistency",
      score: areaScore,
      weight: 0.25,
      detail: disc.differencePercent === null ? "No surveyed area available" : `${disc.differencePercent.toFixed(2)}% area difference`,
    },
    {
      label: "Boundary consistency",
      score: boundaryScore,
      weight: 0.2,
      detail: record.boundaryDisplacement === null ? "No displacement measurement" : `${record.boundaryDisplacement.toFixed(2)} m displacement`,
    },
    {
      label: "RTK confidence",
      score: rtkScore,
      weight: 0.2,
      detail: record.rtk ? `${record.rtk.fixType} solution, ${record.rtk.confidence}%` : "No RTK observation",
    },
    {
      label: "Evidence agreement",
      score: evidenceScore,
      weight: 0.2,
      detail: `${evidence.matches} match, ${evidence.conflicts} conflict, ${evidence.unavailable} unavailable`,
    },
    {
      label: "Record freshness",
      score: freshnessScore,
      weight: 0.15,
      detail: `Last updated ${Math.round(monthsOld)} month(s) ago`,
    },
  ];

  const score = Math.round(factors.reduce((sum, f) => sum + f.score * f.weight, 0));
  const level = score >= 80 ? "High" : score >= 55 ? "Moderate" : "Low";
  return { score, factors, level };
}

export interface RiskResult {
  level: "Low" | "Medium" | "High" | "Critical";
  score: number;
  reasons: string[];
  affectedArea: number | null;
  recommendation: string;
}

export function getRisk(record: LandRecord): RiskResult {
  const disc = getDiscrepancy(record);
  const evidence = getEvidenceAnalysis(record);
  const confidence = getConfidence(record);
  const reasons: string[] = [];
  let score = 0;

  if (disc.differencePercent !== null && disc.differencePercent >= 2) {
    score += Math.min(35, disc.differencePercent * 3);
    reasons.push(`Area mismatch of ${disc.differencePercent.toFixed(2)}%`);
  }
  if ((record.boundaryDisplacement ?? 0) >= 0.5) {
    score += Math.min(25, (record.boundaryDisplacement ?? 0) * 12);
    reasons.push(`Boundary displacement of ${(record.boundaryDisplacement ?? 0).toFixed(2)} m`);
  }
  const hist = record.historicalBoundary;
  if (hist.length >= 2) {
    const growth = hist[hist.length - 1]!.displacement - hist[0]!.displacement;
    if (growth >= 0.3) {
      score += Math.min(15, growth * 8);
      reasons.push(`Historical boundary movement increased by ${growth.toFixed(2)} m since ${hist[0]!.year}`);
    }
  }
  if (evidence.conflicts > 0) {
    score += evidence.conflicts * 10;
    reasons.push(`${evidence.conflicts} conflicting evidence source(s)`);
  }
  if (confidence.score < 80) {
    score += (80 - confidence.score) * 0.4;
    reasons.push(`Verification confidence ${confidence.score}/100`);
  }
  if (evidence.unavailable >= 3) {
    reasons.push("Insufficient independent evidence connected");
    score += 8;
  }

  score = Math.round(Math.max(0, Math.min(100, score)));
  const level = score >= 70 ? "Critical" : score >= 45 ? "High" : score >= 22 ? "Medium" : "Low";
  const affectedArea = disc.difference === null ? null : Math.abs(disc.difference);
  const recommendation =
    level === "Low"
      ? "No field verification required at this stage."
      : level === "Medium"
        ? "Schedule routine field verification."
        : "Field verification recommended on priority.";

  return { level, score, reasons: reasons.length ? reasons : ["No risk indicators detected"], affectedArea, recommendation };
}

export interface PriorityResult {
  score: number;
  level: "Low" | "Medium" | "High" | "Urgent";
  reasons: string[];
  action: string;
}

export function getPriority(record: LandRecord): PriorityResult {
  const disc = getDiscrepancy(record);
  const evidence = getEvidenceAnalysis(record);
  const risk = getRisk(record);
  const reasons: string[] = [];

  let score = risk.score * 0.6;
  if (disc.differencePercent !== null && disc.differencePercent >= 5) {
    score += 15;
    reasons.push("Area difference above 5%");
  }
  if ((record.boundaryDisplacement ?? 0) >= 1.5) {
    score += 12;
    reasons.push("Boundary displacement above 1.5 m");
  }
  if (evidence.conflicts > 0) {
    score += 8;
    reasons.push("Evidence conflict present");
  }
  if (record.status === "Needs Review" || record.status === "Pending Verification") {
    score += 6;
    reasons.push(`Record status: ${record.status}`);
  }

  score = Math.round(Math.max(0, Math.min(100, score)));
  const level = score >= 70 ? "Urgent" : score >= 45 ? "High" : score >= 22 ? "Medium" : "Low";
  const action =
    level === "Urgent"
      ? "Assign field verification within 7 days"
      : level === "High"
        ? "Assign field verification within 30 days"
        : level === "Medium"
          ? "Queue for routine verification"
          : "Monitor only";
  return { score, level, reasons: reasons.length ? reasons : ["No priority drivers detected"], action };
}

export interface SimulationResult {
  shift: number;
  simulatedSurveyedArea: number | null;
  areaDiscrepancy: number | null;
  discrepancyPercent: number | null;
  affectedArea: number | null;
  confidence: number;
  confidenceChange: number;
}

/**
 * Read-only hypothetical: never mutates the land record.
 * A boundary shift of `shift` metres applied around an approximately square parcel
 * changes the enclosed area by perimeter x shift.
 */
export function simulateShift(record: LandRecord, shift: number): SimulationResult {
  const base = getConfidence(record);
  if (record.surveyedArea === null) {
    return {
      shift,
      simulatedSurveyedArea: null,
      areaDiscrepancy: null,
      discrepancyPercent: null,
      affectedArea: null,
      confidence: base.score,
      confidenceChange: 0,
    };
  }
  const sideMetres = Math.sqrt(record.surveyedArea * 4046.86);
  const affectedSqm = 4 * sideMetres * shift;
  const affectedAcres = affectedSqm / 4046.86;
  const simulatedSurveyedArea = Math.max(0, record.surveyedArea - affectedAcres);
  const areaDiscrepancy = record.governmentArea - simulatedSurveyedArea;
  const discrepancyPercent = (Math.abs(areaDiscrepancy) / record.governmentArea) * 100;

  const areaScore = Math.max(0, 100 - discrepancyPercent * 3);
  const boundaryScore = Math.max(0, 100 - ((record.boundaryDisplacement ?? 0) + shift) * 20);
  const adjusted = base.factors.map((f) =>
    f.label === "Area consistency" ? { ...f, score: areaScore } : f.label === "Boundary consistency" ? { ...f, score: boundaryScore } : f,
  );
  const confidence = Math.round(adjusted.reduce((sum, f) => sum + f.score * f.weight, 0));

  return {
    shift,
    simulatedSurveyedArea,
    areaDiscrepancy,
    discrepancyPercent,
    affectedArea: affectedAcres,
    confidence,
    confidenceChange: confidence - base.score,
  };
}

export function getBoundaryTrend(record: LandRecord) {
  const hist = record.historicalBoundary;
  if (hist.length < 2) return { trend: "Data Unavailable" as const, ratePerYear: null as number | null };
  const first = hist[0]!;
  const last = hist[hist.length - 1]!;
  const delta = last.displacement - first.displacement;
  const years = Math.max(1, last.year - first.year);
  return {
    trend: (delta > 0.05 ? "Increasing outward movement" : delta < -0.05 ? "Reverting inward" : "Stable") as
      | "Increasing outward movement"
      | "Reverting inward"
      | "Stable",
    ratePerYear: delta / years,
  };
}
