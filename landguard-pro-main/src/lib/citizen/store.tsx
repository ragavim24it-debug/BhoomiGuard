import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  CitizenNotification,
  CitizenProfile,
  CitizenRequest,
  LandDocument,
  LandParcel,
  LandSurvey,
} from "./data";

export interface CitizenState {
  citizenId: string | null;
  selectedLandId: string | null;
  profiles: CitizenProfile[];
  lands: LandParcel[];
  accessMap: Record<string, string[]>; // citizenId -> landId[]
  surveys: LandSurvey[];
  documents: LandDocument[];
  requests: CitizenRequest[];
  notifications: CitizenNotification[];
}

export interface SubmitRequestInput {
  landId: string;
  requestType: "Report Issue" | "Re-verification";
  issueType?: string;
  reason: string;
  documentName?: string;
  photoName?: string;
}

export interface CitizenContextValue {
  citizenId: string | null;
  currentProfile: CitizenProfile | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  lands: LandParcel[];
  selectedLand: LandParcel | null;
  surveys: LandSurvey[];
  documents: LandDocument[];
  requests: CitizenRequest[];
  notifications: CitizenNotification[];
  unreadNotificationCount: number;
  login: (citizenId: string) => void;
  logout: () => void;
  selectLand: (landId: string) => void;
  submitRequest: (input: SubmitRequestInput) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  switchDemoCitizen: (id: string) => void;
}

const STORAGE_KEY = "bhoomiguard.citizen.v1";

export const DEMO_PROFILES: CitizenProfile[] = [
  {
    id: "citizen-01",
    full_name: "Ramasamy Gounder",
    email: "citizen01@bhoomiguard.in",
    phone: "+91 98421 23456",
    village: "Kannampalayam",
  },
  {
    id: "citizen-02",
    full_name: "Palanisamy Murugan",
    email: "citizen02@bhoomiguard.in",
    phone: "+91 94432 78901",
    village: "Ingur",
  },
];

export const DEMO_LAND_ACCESS: Record<string, string[]> = {
  "citizen-01": ["land-245-3", "land-247-2"],
  "citizen-02": ["land-250-1", "land-251-4"],
};

export const INITIAL_LAND_PARCELS: LandParcel[] = [
  {
    id: "land-245-3",
    survey_number: "245/3",
    sub_division: "3",
    patta_number: "1042",
    district: "Coimbatore",
    taluk: "Sulur",
    village: "Kannampalayam",
    classification: "Dry Agricultural (Punjai)",
    government_area: 2.4,
    surveyed_area: 2.18,
    boundary_displacement: 1.7,
    verification_status: "Attention Required",
    boundary_status: "Verification Required",
    latest_survey_date: "2026-08-29",
    source: "Village Record + Drone + RTK",
    latitude: 11.0246,
    longitude: 77.1256,
    boundary_geometry: null,
    drone_survey_date: "2026-08-28",
    drone_survey_status: "Completed",
    drone_surveyed_area: 2.18,
    rtk_survey_date: "2026-08-29",
    rtk_status: "Fixed (High Accuracy)",
    rtk_public_accuracy: "± 2.4 cm",
    is_demo: true,
    last_updated: "2026-09-02",
  },
  {
    id: "land-247-2",
    survey_number: "247/2",
    sub_division: "2",
    patta_number: "1108",
    district: "Coimbatore",
    taluk: "Sulur",
    village: "Kannampalayam",
    classification: "Wet Agricultural (Nanjai)",
    government_area: 1.85,
    surveyed_area: 1.84,
    boundary_displacement: 0.15,
    verification_status: "Verified",
    boundary_status: "Verified",
    latest_survey_date: "2026-07-14",
    source: "Village Record + RTK",
    latitude: 11.0268,
    longitude: 77.1285,
    boundary_geometry: null,
    drone_survey_date: null,
    drone_survey_status: null,
    drone_surveyed_area: null,
    rtk_survey_date: "2026-07-14",
    rtk_status: "Fixed",
    rtk_public_accuracy: "± 1.8 cm",
    is_demo: true,
    last_updated: "2026-07-15",
  },
  {
    id: "land-250-1",
    survey_number: "250/1",
    sub_division: "1",
    patta_number: "2041",
    district: "Erode",
    taluk: "Perundurai",
    village: "Ingur",
    classification: "Wet Agricultural",
    government_area: 3.5,
    surveyed_area: 3.48,
    boundary_displacement: 0.2,
    verification_status: "Verified",
    boundary_status: "Verified",
    latest_survey_date: "2026-06-20",
    source: "Village Record + Drone",
    latitude: 11.2405,
    longitude: 77.5512,
    boundary_geometry: null,
    drone_survey_date: "2026-06-18",
    drone_survey_status: "Completed",
    drone_surveyed_area: 3.48,
    rtk_survey_date: null,
    rtk_status: null,
    rtk_public_accuracy: null,
    is_demo: true,
    last_updated: "2026-06-21",
  },
  {
    id: "land-251-4",
    survey_number: "251/4",
    sub_division: "4",
    patta_number: "2049",
    district: "Erode",
    taluk: "Perundurai",
    village: "Ingur",
    classification: "Dry Agricultural",
    government_area: 1.9,
    surveyed_area: 1.72,
    boundary_displacement: 1.3,
    verification_status: "Attention Required",
    boundary_status: "Verification Required",
    latest_survey_date: "2026-05-18",
    source: "Village Record + RTK",
    latitude: 11.2431,
    longitude: 77.5534,
    boundary_geometry: null,
    drone_survey_date: null,
    drone_survey_status: null,
    drone_surveyed_area: null,
    rtk_survey_date: "2026-05-18",
    rtk_status: "Fixed",
    rtk_public_accuracy: "± 2.0 cm",
    is_demo: true,
    last_updated: "2026-05-19",
  },
  {
    id: "land-245-8",
    survey_number: "245/8",
    sub_division: "8",
    patta_number: "1050",
    district: "Coimbatore",
    taluk: "Sulur",
    village: "Kannampalayam",
    classification: "Dry Agricultural",
    government_area: 1.2,
    surveyed_area: 1.19,
    boundary_displacement: 0.1,
    verification_status: "Verified",
    boundary_status: "Verified",
    latest_survey_date: "2026-08-10",
    source: "Village Record",
    latitude: 11.0255,
    longitude: 77.127,
    boundary_geometry: null,
    drone_survey_date: null,
    drone_survey_status: null,
    drone_surveyed_area: null,
    rtk_survey_date: null,
    rtk_status: null,
    rtk_public_accuracy: null,
    is_demo: true,
    last_updated: "2026-08-11",
  },
];

export const INITIAL_LAND_SURVEYS: LandSurvey[] = [
  {
    id: "srv-245-3-2015",
    land_id: "land-245-3",
    survey_date: "2015-06-12",
    survey_type: "Cadastral ETS Ground Survey",
    surveyed_area: 2.38,
    boundary_movement: 0.4,
    verification_status: "Verified",
    boundary_status: "Verified",
    public_result: "Baseline historical revenue settlement survey. Boundary consistent with revenue records.",
    is_demo: true,
  },
  {
    id: "srv-245-3-2020",
    land_id: "land-245-3",
    survey_date: "2020-09-18",
    survey_type: "District Settlement Re-survey",
    surveyed_area: 2.3,
    boundary_movement: 0.9,
    verification_status: "Pending",
    boundary_status: "Pending Verification",
    public_result: "Sub-division check recorded minor boundary variation (0.9 m) on western perimeter.",
    is_demo: true,
  },
  {
    id: "srv-245-3-2026",
    land_id: "land-245-3",
    survey_date: "2026-08-29",
    survey_type: "AI Drone Orthomosaic + RTK Rover",
    surveyed_area: 2.18,
    boundary_movement: 1.7,
    verification_status: "Attention Required",
    boundary_status: "Verification Required",
    public_result: "Latest high-precision survey observed 0.22 acres area difference and 1.7 m boundary displacement.",
    is_demo: true,
  },
  {
    id: "srv-247-2-2026",
    land_id: "land-247-2",
    survey_date: "2026-07-14",
    survey_type: "GNSS RTK Cadastral Verification",
    surveyed_area: 1.84,
    boundary_movement: 0.15,
    verification_status: "Verified",
    boundary_status: "Verified",
    public_result: "Physical ground markers match government record within 0.01 acre margin.",
    is_demo: true,
  },
  {
    id: "srv-250-1-2026",
    land_id: "land-250-1",
    survey_date: "2026-06-20",
    survey_type: "Drone Photogrammetry",
    surveyed_area: 3.48,
    boundary_movement: 0.2,
    verification_status: "Verified",
    boundary_status: "Verified",
    public_result: "Survey area 3.48 acres aligns with 3.50 acres record.",
    is_demo: true,
  },
  {
    id: "srv-251-4-2026",
    land_id: "land-251-4",
    survey_date: "2026-05-18",
    survey_type: "GNSS RTK Cadastral Verification",
    surveyed_area: 1.72,
    boundary_movement: 1.3,
    verification_status: "Attention Required",
    boundary_status: "Verification Required",
    public_result: "Variation of 0.18 acres observed against 1.90 acres government area.",
    is_demo: true,
  },
];

export const INITIAL_LAND_DOCUMENTS: LandDocument[] = [
  {
    id: "doc-patta-245-3",
    land_id: "land-245-3",
    title: "Patta / Chitta Extract (Patta No. 1042)",
    document_type: "Revenue Record",
    issued_on: "2024-01-15",
    reference: "TN/REV/2024/1042",
    file_path: "/documents/patta-1042.pdf",
    uploaded_by: null,
    is_demo: true,
  },
  {
    id: "doc-fmb-245-3",
    land_id: "land-245-3",
    title: "Field Measurement Book (FMB) Sketch",
    document_type: "Cadastral Map",
    issued_on: "2022-08-10",
    reference: "FMB/SLR/245-3",
    file_path: "/documents/fmb-245-3.pdf",
    uploaded_by: null,
    is_demo: true,
  },
  {
    id: "doc-drone-245-3",
    land_id: "land-245-3",
    title: "Drone Survey Verification Certificate (2026)",
    document_type: "Survey Certificate",
    issued_on: "2026-08-30",
    reference: "BG/DRN/2026/088",
    file_path: "/documents/survey-cert-245-3.pdf",
    uploaded_by: null,
    is_demo: true,
  },
  {
    id: "doc-patta-247-2",
    land_id: "land-247-2",
    title: "Patta Extract (Patta No. 1108)",
    document_type: "Revenue Record",
    issued_on: "2023-11-20",
    reference: "TN/REV/2023/1108",
    file_path: "/documents/patta-1108.pdf",
    uploaded_by: null,
    is_demo: true,
  },
  {
    id: "doc-patta-250-1",
    land_id: "land-250-1",
    title: "Patta Extract (Patta No. 2041)",
    document_type: "Revenue Record",
    issued_on: "2024-03-02",
    reference: "TN/REV/2024/2041",
    file_path: "/documents/patta-2041.pdf",
    uploaded_by: null,
    is_demo: true,
  },
];

export const INITIAL_CITIZEN_REQUESTS: CitizenRequest[] = [
  {
    id: "req-01",
    citizen_id: "citizen-01",
    land_id: "land-245-3",
    request_code: "BG-2026-01042",
    request_type: "Report Issue",
    issue_type: "Area mismatch",
    reason: "Recorded area shows 2.40 acres, but recent survey observed 2.18 acres. Requesting field verification.",
    photo_path: "boundary-marker-west.jpg",
    document_path: "patta-copy.pdf",
    status: "Field Verification",
    latest_update: "Assigned to Taluk Revenue Surveyor for ground boundary demarcation.",
    created_at: "2026-09-03T10:15:00Z",
    updated_at: "2026-09-08T14:30:00Z",
  },
];

export const INITIAL_CITIZEN_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: "notif-01",
    land_id: "land-245-3",
    category: "Verification",
    title: "Attention Required: Survey No. 245/3",
    message: "A difference of 0.22 acres was observed between the recorded area (2.40 ac) and latest survey (2.18 ac). Boundary verification is required.",
    is_read: false,
    created_at: "2026-09-02T09:00:00Z",
  },
  {
    id: "notif-02",
    land_id: "land-245-3",
    category: "Survey",
    title: "2026 Drone & RTK Survey Completed",
    message: "High-precision digital mapping results for Survey No. 245/3 are now available in your Verification Center.",
    is_read: false,
    created_at: "2026-08-30T11:20:00Z",
  },
  {
    id: "notif-03",
    land_id: "land-245-3",
    category: "Request",
    title: "Request BG-2026-01042 Status Update",
    message: "Your reported issue has progressed to 'Field Verification'. A surveyor has been assigned.",
    is_read: true,
    created_at: "2026-09-08T14:30:00Z",
  },
  {
    id: "notif-04",
    land_id: "land-247-2",
    category: "Verification",
    title: "Survey No. 247/2 Verified",
    message: "Government recorded area and RTK survey match. Boundary status is Verified.",
    is_read: true,
    created_at: "2026-07-15T08:00:00Z",
  },
];

const CitizenContext = createContext<CitizenContextValue | null>(null);

export function CitizenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CitizenState>({
    citizenId: "citizen-01", // Default to Demo Citizen 01 for smooth demonstration
    selectedLandId: "land-245-3",
    profiles: DEMO_PROFILES,
    lands: INITIAL_LAND_PARCELS,
    accessMap: DEMO_LAND_ACCESS,
    surveys: INITIAL_LAND_SURVEYS,
    documents: INITIAL_LAND_DOCUMENTS,
    requests: INITIAL_CITIZEN_REQUESTS,
    notifications: INITIAL_CITIZEN_NOTIFICATIONS,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CitizenState>;
        setState((prev) => ({
          ...prev,
          citizenId: parsed.citizenId !== undefined ? parsed.citizenId : prev.citizenId,
          selectedLandId: parsed.selectedLandId || prev.selectedLandId,
          requests: parsed.requests?.length ? parsed.requests : prev.requests,
          notifications: parsed.notifications?.length ? parsed.notifications : prev.notifications,
        }));
      }
    } catch {
      /* ignore storage failure */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage quota/unavailable */
    }
  }, [state, hydrated]);

  const login = useCallback((citizenId: string) => {
    setState((prev) => {
      const allowedLandIds = prev.accessMap[citizenId] ?? [];
      const firstLandId = allowedLandIds[0] ?? null;
      return {
        ...prev,
        citizenId,
        selectedLandId: firstLandId,
      };
    });
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      citizenId: null,
      selectedLandId: null,
    }));
  }, []);

  const switchDemoCitizen = useCallback((id: string) => {
    setState((prev) => {
      const allowedLandIds = prev.accessMap[id] ?? [];
      return {
        ...prev,
        citizenId: id,
        selectedLandId: allowedLandIds[0] ?? null,
      };
    });
  }, []);

  const selectLand = useCallback((landId: string) => {
    setState((prev) => ({
      ...prev,
      selectedLandId: landId,
    }));
  }, []);

  const submitRequest = useCallback((input: SubmitRequestInput): string => {
    const seq = Math.floor(1000 + Math.random() * 9000);
    const requestCode = `BG-2026-${seq}`;
    const newReq: CitizenRequest = {
      id: `req-${Date.now()}`,
      citizen_id: state.citizenId ?? "citizen-01",
      land_id: input.landId,
      request_code: requestCode,
      request_type: input.requestType,
      issue_type: input.issueType ?? null,
      reason: input.reason,
      photo_path: input.photoName ?? null,
      document_path: input.documentName ?? null,
      status: "Submitted",
      latest_update: "Request received and queued for officer assignment.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const targetLand = state.lands.find((l) => l.id === input.landId);
    const newNotif: CitizenNotification = {
      id: `notif-${Date.now()}`,
      land_id: input.landId,
      category: "Request",
      title: `New Request Created: ${requestCode}`,
      message: `Your ${input.requestType.toLowerCase()} for Survey No. ${targetLand?.survey_number ?? "—"} has been submitted successfully.`,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      requests: [newReq, ...prev.requests],
      notifications: [newNotif, ...prev.notifications],
    }));

    return requestCode;
  }, [state.citizenId, state.lands]);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, is_read: true })),
    }));
  }, []);

  const value = useMemo<CitizenContextValue>(() => {
    const currentProfile = state.profiles.find((p) => p.id === state.citizenId) ?? null;
    const allowedLandIds = state.citizenId ? state.accessMap[state.citizenId] ?? [] : [];
    const authorizedLands = state.lands.filter((l) => allowedLandIds.includes(l.id));
    const selectedLand = authorizedLands.find((l) => l.id === state.selectedLandId) ?? authorizedLands[0] ?? null;

    const authorizedLandIds = new Set(authorizedLands.map((l) => l.id));
    const relevantSurveys = state.surveys.filter((s) => selectedLand && s.land_id === selectedLand.id);
    const relevantDocuments = state.documents.filter((d) => selectedLand && d.land_id === selectedLand.id);
    const citizenRequests = state.requests.filter(
      (r) => r.citizen_id === state.citizenId && authorizedLandIds.has(r.land_id),
    );
    const relevantNotifications = state.notifications.filter(
      (n) => !n.land_id || authorizedLandIds.has(n.land_id),
    );
    const unreadNotificationCount = relevantNotifications.filter((n) => !n.is_read).length;

    return {
      citizenId: state.citizenId,
      currentProfile,
      isAuthenticated: Boolean(state.citizenId),
      hydrated,
      lands: authorizedLands,
      selectedLand,
      surveys: relevantSurveys,
      documents: relevantDocuments,
      requests: citizenRequests,
      notifications: relevantNotifications,
      unreadNotificationCount,
      login,
      logout,
      selectLand,
      submitRequest,
      markNotificationRead,
      markAllNotificationsRead,
      switchDemoCitizen,
    };
  }, [
    state,
    hydrated,
    login,
    logout,
    selectLand,
    submitRequest,
    markNotificationRead,
    markAllNotificationsRead,
    switchDemoCitizen,
  ]);

  return <CitizenContext.Provider value={value}>{children}</CitizenContext.Provider>;
}

export function useCitizen() {
  const ctx = useContext(CitizenContext);
  if (!ctx) throw new Error("useCitizen must be used within CitizenProvider");
  return ctx;
}
