import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { LAND_RECORDS, type FieldStatus, type LandRecord, type LandStatus } from "./data";

export interface FieldVerification {
  surveyNumber: string;
  gps: string;
  date: string;
  photoName: string | null;
  remarks: string;
  status: FieldStatus;
  officer: string;
  submittedAt: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  surveyNumber: string;
  timestamp: string;
  status: "Success" | "Info" | "Attention";
}

interface OfficerState {
  officerId: string | null;
  records: LandRecord[];
  selectedId: string;
  fieldVerifications: FieldVerification[];
  audit: AuditEntry[];
}

interface OfficerContextValue extends OfficerState {
  selectedRecord: LandRecord;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (officerId: string) => void;
  logout: () => void;
  selectRecord: (id: string) => void;
  logAction: (action: string, surveyNumber?: string, status?: AuditEntry["status"]) => void;
  submitFieldVerification: (input: Omit<FieldVerification, "officer" | "submittedAt" | "surveyNumber">) => void;
}

const STORAGE_KEY = "bhoomiguard.officer.v1";

const OfficerContext = createContext<OfficerContextValue | null>(null);

const fieldToLandStatus = (status: FieldStatus): LandStatus =>
  status === "Verified"
    ? "Verified"
    : status === "Needs Review"
      ? "Needs Review"
      : status === "In Progress"
        ? "Pending Verification"
        : "Pending Verification";

export function OfficerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OfficerState>({
    officerId: null,
    records: LAND_RECORDS,
    selectedId: LAND_RECORDS[0]!.id,
    fieldVerifications: [],
    audit: [],
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OfficerState>;
        setState((prev) => ({
          officerId: parsed.officerId ?? null,
          records: parsed.records?.length ? parsed.records : prev.records,
          selectedId: parsed.selectedId ?? prev.selectedId,
          fieldVerifications: parsed.fieldVerifications ?? [],
          audit: parsed.audit ?? [],
        }));
      }
    } catch {
      /* ignore corrupt local state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const logAction = useCallback(
    (action: string, surveyNumber = "—", status: AuditEntry["status"] = "Success") => {
      setState((prev) => ({
        ...prev,
        audit: [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            user: prev.officerId ?? "Officer",
            action,
            surveyNumber,
            timestamp: new Date().toISOString(),
            status,
          },
          ...prev.audit,
        ].slice(0, 200),
      }));
    },
    [],
  );

  const login = useCallback((officerId: string) => {
    setState((prev) => ({
      ...prev,
      officerId,
      audit: [
        {
          id: `${Date.now()}-login`,
          user: officerId,
          action: "Login",
          surveyNumber: "—",
          timestamp: new Date().toISOString(),
          status: "Success" as const,
        },
        ...prev.audit,
      ],
    }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, officerId: null }));
  }, []);

  const selectRecord = useCallback((id: string) => {
    setState((prev) => (prev.selectedId === id ? prev : { ...prev, selectedId: id }));
  }, []);

  const submitFieldVerification: OfficerContextValue["submitFieldVerification"] = useCallback(
    (input) => {
      setState((prev) => {
        const record = prev.records.find((r) => r.id === prev.selectedId)!;
        const entry: FieldVerification = {
          ...input,
          surveyNumber: record.surveyNumber,
          officer: prev.officerId ?? "Officer",
          submittedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          fieldVerifications: [entry, ...prev.fieldVerifications.filter((f) => f.surveyNumber !== record.surveyNumber)],
          records: prev.records.map((r) =>
            r.id === record.id
              ? { ...r, status: fieldToLandStatus(input.status), lastUpdated: input.date, source: `${r.source} + Field Verification` }
              : r,
          ),
          audit: [
            {
              id: `${Date.now()}-fv`,
              user: prev.officerId ?? "Officer",
              action: `Field verification submitted (${input.status})`,
              surveyNumber: record.surveyNumber,
              timestamp: new Date().toISOString(),
              status: input.status === "Needs Review" ? ("Attention" as const) : ("Success" as const),
            },
            ...prev.audit,
          ],
        };
      });
    },
    [],
  );

  const value = useMemo<OfficerContextValue>(() => {
    const selectedRecord = state.records.find((r) => r.id === state.selectedId) ?? state.records[0]!;
    return {
      ...state,
      selectedRecord,
      isAuthenticated: Boolean(state.officerId),
      hydrated,
      login,
      logout,
      selectRecord,
      logAction,
      submitFieldVerification,
    };
  }, [state, hydrated, login, logout, selectRecord, logAction, submitFieldVerification]);

  return <OfficerContext.Provider value={value}>{children}</OfficerContext.Provider>;
}

export function useOfficer() {
  const ctx = useContext(OfficerContext);
  if (!ctx) throw new Error("useOfficer must be used inside OfficerProvider");
  return ctx;
}

export function useFieldVerification(surveyNumber: string) {
  const { fieldVerifications } = useOfficer();
  return fieldVerifications.find((f) => f.surveyNumber === surveyNumber) ?? null;
}
