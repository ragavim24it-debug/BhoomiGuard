import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, StatCard, Tag } from "@/components/officer/shell";
import { cn } from "@/lib/utils";
import { CITIZEN_DEMO_LABEL, formatDate, type CitizenStatus, type LandParcel } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export { EmptyState, InfoRow, PageHeader, Panel, StatCard, Tag };

export function DemoNotice({ className, text = CITIZEN_DEMO_LABEL }: { className?: string; text?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-primary/30 bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-deep",
        className,
      )}
    >
      <Info className="size-4 shrink-0 text-brand-bright" />
      {text}
    </div>
  );
}

const statusTone: Record<CitizenStatus, "good" | "warn" | "bad"> = {
  VERIFIED: "good",
  PENDING: "warn",
  "ATTENTION REQUIRED": "bad",
};

export function StatusTag({ status }: { status: CitizenStatus }) {
  return <Tag tone={statusTone[status]}>{status}</Tag>;
}

export function RequestStatusTag({ status }: { status: string }) {
  const done = ["Resolved", "Completed"].includes(status);
  return <Tag tone={done ? "good" : status === "Field Verification" ? "warn" : "muted"}>{status}</Tag>;
}

export function SelectedLandBar({ extra }: { extra?: ReactNode }) {
  const { lands, selectedLand, selectLand } = useCitizen();
  if (!selectedLand) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected land</p>
        <p className="text-base font-extrabold text-brand-deep">
          Survey No. {selectedLand.survey_number} · {selectedLand.village}, {selectedLand.taluk}, {selectedLand.district}
        </p>
        <p className="text-xs text-muted-foreground">
          {selectedLand.classification} · Latest survey {formatDate(selectedLand.latest_survey_date)}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <label className="text-xs font-semibold text-muted-foreground" htmlFor="citizen-land-switch">
          Switch land
        </label>
        <select
          id="citizen-land-switch"
          value={selectedLand.id}
          onChange={(event) => selectLand(event.target.value)}
          className="h-10 rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
        >
          {lands.map((land: LandParcel) => (
            <option key={land.id} value={land.id}>
              {land.survey_number} — {land.village}
            </option>
          ))}
        </select>
        {extra}
      </div>
    </div>
  );
}

export function LoadingPanel({ label = "Loading your land information…" }: { label?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center text-sm font-medium text-muted-foreground shadow-sm">
      {label}
    </div>
  );
}

export function CompareCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return <StatCard label={label} value={value} hint={hint} icon={Icon} />;
}
