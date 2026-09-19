/**
 * BHOOMIGUARD — Officer Portal shared land-record data model.
 *
 * ALL data in this file is clearly labelled DEMO DATA and is NOT a government record.
 * No cadastral boundary geometry is invented: `boundaryGeometry` is null until an
 * authorized data source (GeoJSON / KML / CSV / Drone / RTK) is connected.
 */

export const DEMO_DATA_LABEL = "DEMO DATA — NOT GOVERNMENT RECORD";

export type LandStatus = "Verified" | "Pending Verification" | "Discrepancy" | "Needs Review";
export type FieldStatus = "Pending" | "In Progress" | "Verified" | "Needs Review";
export type EvidenceState = "MATCH" | "CONFLICT" | "UNAVAILABLE";

export interface HistoricalBoundaryPoint {
  year: number;
  displacement: number; // metres
}

export interface CrossParcelRelation {
  surveyNumber: string;
  overlap: number; // acres
  gap: number; // acres
  crossing: boolean;
  sharedBoundaryMovement: number; // metres
}

export interface LandRecord {
  id: string;
  surveyNumber: string;
  subDivision: string;
  pattaNumber: string;
  district: string;
  taluk: string;
  village: string;
  area: number; // acres (record of rights)
  classification: string;
  boundaryGeometry: GeoJSON.Geometry | null;
  status: LandStatus;
  source: string;
  lastUpdated: string; // ISO date
  governmentArea: number; // acres
  surveyedArea: number | null; // acres (drone / RTK derived)
  boundaryDisplacement: number | null; // metres
  historicalBoundary: HistoricalBoundaryPoint[];
  droneSurvey: { date: string; sensor: string; gsd: string; coverage: string } | null;
  rtk: { date: string; receiver: string; fixType: string; confidence: number; points: number } | null;
  gisRecordArea: number | null;
  crossParcel: CrossParcelRelation[];
  approxCenter: [number, number]; // approximate village location, for map centring only
  isDemo: boolean;
}

export const LAND_RECORDS: LandRecord[] = [
  {
    id: "245-3",
    surveyNumber: "245/3",
    subDivision: "3",
    pattaNumber: "1042",
    district: "Coimbatore",
    taluk: "Sulur",
    village: "Kannampalayam",
    area: 2.4,
    classification: "Dry Agricultural",
    boundaryGeometry: null,
    status: "Discrepancy",
    source: "Village Record + Drone + RTK",
    lastUpdated: "2026-09-02",
    governmentArea: 2.4,
    surveyedArea: 2.18,
    boundaryDisplacement: 1.7,
    historicalBoundary: [
      { year: 2015, displacement: 0.4 },
      { year: 2020, displacement: 0.9 },
      { year: 2026, displacement: 1.7 },
    ],
    droneSurvey: { date: "2026-08-28", sensor: "RGB 20MP", gsd: "2.4 cm/px", coverage: "Full parcel" },
    rtk: { date: "2026-08-29", receiver: "GNSS RTK Rover", fixType: "Fixed", confidence: 96, points: 34 },
    gisRecordArea: 2.36,
    crossParcel: [
      { surveyNumber: "245/2", overlap: 0.09, gap: 0, crossing: true, sharedBoundaryMovement: 1.4 },
      { surveyNumber: "245/4", overlap: 0, gap: 0.05, crossing: false, sharedBoundaryMovement: 0.6 },
    ],
    approxCenter: [11.0246, 77.1256],
    isDemo: true,
  },
  {
    id: "112-1",
    surveyNumber: "112/1",
    subDivision: "1",
    pattaNumber: "884",
    district: "Coimbatore",
    taluk: "Sulur",
    village: "Kannampalayam",
    area: 1.6,
    classification: "Wet Agricultural",
    boundaryGeometry: null,
    status: "Verified",
    source: "Village Record + RTK",
    lastUpdated: "2026-07-18",
    governmentArea: 1.6,
    surveyedArea: 1.59,
    boundaryDisplacement: 0.2,
    historicalBoundary: [
      { year: 2015, displacement: 0.1 },
      { year: 2020, displacement: 0.15 },
      { year: 2026, displacement: 0.2 },
    ],
    droneSurvey: null,
    rtk: { date: "2026-07-16", receiver: "GNSS RTK Rover", fixType: "Fixed", confidence: 94, points: 22 },
    gisRecordArea: 1.6,
    crossParcel: [],
    approxCenter: [11.0281, 77.1301],
    isDemo: true,
  },
  {
    id: "87-2A",
    surveyNumber: "87/2A",
    subDivision: "2A",
    pattaNumber: "512",
    district: "Erode",
    taluk: "Perundurai",
    village: "Vijayapuri",
    area: 3.1,
    classification: "Dry Agricultural",
    boundaryGeometry: null,
    status: "Pending Verification",
    source: "Village Record",
    lastUpdated: "2024-11-05",
    governmentArea: 3.1,
    surveyedArea: null,
    boundaryDisplacement: null,
    historicalBoundary: [],
    droneSurvey: null,
    rtk: null,
    gisRecordArea: null,
    crossParcel: [],
    approxCenter: [11.2758, 77.5871],
    isDemo: true,
  },
  {
    id: "301-5",
    surveyNumber: "301/5",
    subDivision: "5",
    pattaNumber: "2210",
    district: "Erode",
    taluk: "Perundurai",
    village: "Ingur",
    area: 4.05,
    classification: "Punjai / Dry",
    boundaryGeometry: null,
    status: "Discrepancy",
    source: "Village Record + Drone",
    lastUpdated: "2026-06-11",
    governmentArea: 4.05,
    surveyedArea: 3.81,
    boundaryDisplacement: 1.1,
    historicalBoundary: [
      { year: 2015, displacement: 0.3 },
      { year: 2020, displacement: 0.7 },
      { year: 2026, displacement: 1.1 },
    ],
    droneSurvey: { date: "2026-06-09", sensor: "RGB 20MP", gsd: "3.1 cm/px", coverage: "Partial (82%)" },
    rtk: null,
    gisRecordArea: 3.98,
    crossParcel: [{ surveyNumber: "301/6", overlap: 0.04, gap: 0, crossing: false, sharedBoundaryMovement: 0.9 }],
    approxCenter: [11.2401, 77.5502],
    isDemo: true,
  },
  {
    id: "64-1",
    surveyNumber: "64/1",
    subDivision: "1",
    pattaNumber: "310",
    district: "Salem",
    taluk: "Sankari",
    village: "Nallipalayam",
    area: 0.95,
    classification: "House Site",
    boundaryGeometry: null,
    status: "Verified",
    source: "Village Record + GIS",
    lastUpdated: "2026-05-22",
    governmentArea: 0.95,
    surveyedArea: 0.94,
    boundaryDisplacement: 0.15,
    historicalBoundary: [
      { year: 2015, displacement: 0.05 },
      { year: 2020, displacement: 0.1 },
      { year: 2026, displacement: 0.15 },
    ],
    droneSurvey: null,
    rtk: { date: "2026-05-20", receiver: "GNSS RTK Rover", fixType: "Fixed", confidence: 91, points: 14 },
    gisRecordArea: 0.95,
    crossParcel: [],
    approxCenter: [11.4762, 77.8709],
    isDemo: true,
  },
  {
    id: "158-4",
    surveyNumber: "158/4",
    subDivision: "4",
    pattaNumber: "1765",
    district: "Salem",
    taluk: "Sankari",
    village: "Thevur",
    area: 2.75,
    classification: "Nanjai / Wet",
    boundaryGeometry: null,
    status: "Needs Review",
    source: "Village Record + GIS",
    lastUpdated: "2025-12-14",
    governmentArea: 2.75,
    surveyedArea: 2.66,
    boundaryDisplacement: 0.8,
    historicalBoundary: [
      { year: 2015, displacement: 0.2 },
      { year: 2020, displacement: 0.5 },
      { year: 2026, displacement: 0.8 },
    ],
    droneSurvey: null,
    rtk: null,
    gisRecordArea: 2.7,
    crossParcel: [{ surveyNumber: "158/5", overlap: 0, gap: 0.03, crossing: false, sharedBoundaryMovement: 0.4 }],
    approxCenter: [11.4508, 77.8351],
    isDemo: true,
  },
];

export const DISTRICTS = [...new Set(LAND_RECORDS.map((r) => r.district))].sort();
export const TALUKS = [...new Set(LAND_RECORDS.map((r) => r.taluk))].sort();
export const VILLAGES = [...new Set(LAND_RECORDS.map((r) => r.village))].sort();

export const formatAcres = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)} acres`;

export const formatMetres = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)} m`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
