import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { DEMO_DATA_LABEL, formatDate, type LandRecord } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-primary/30 bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-deep",
        className,
      )}
    >
      <AlertTriangle className="size-4 shrink-0 text-brand-bright" />
      {DEMO_DATA_LABEL}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-secondary text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-brand-deep sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card p-5 shadow-sm", className)}>
      {title ? (
        <header className="mb-4">
          <h2 className="text-base font-bold text-brand-deep">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-md bg-secondary text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-brand-deep">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const toneClasses: Record<string, string> = {
  good: "bg-secondary text-brand-deep border-primary/30",
  warn: "bg-accent text-brand-deep border-brand-soft",
  bad: "bg-destructive/10 text-destructive border-destructive/30",
  muted: "bg-muted text-muted-foreground border-border",
};

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: keyof typeof toneClasses }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", toneClasses[tone])}>
      {children}
    </span>
  );
}

export function statusTone(status: string): keyof typeof toneClasses {
  if (["Verified", "MATCH", "Within Tolerance", "High", "Low", "Stable"].includes(status)) return "good";
  if (["Pending Verification", "Needs Review", "Minor Discrepancy", "Moderate", "Medium", "In Progress", "Pending"].includes(status))
    return "warn";
  if (["Discrepancy", "CONFLICT", "Significant Discrepancy", "Critical", "Urgent"].includes(status)) return "bad";
  return "muted";
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-brand-deep">{value}</span>
    </div>
  );
}

export function SelectedRecordBar({ record }: { record: LandRecord }) {
  const { records, selectRecord } = useOfficer();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected land record</p>
        <p className="text-base font-extrabold text-brand-deep">
          Survey No. {record.surveyNumber} · {record.village}, {record.taluk}, {record.district}
        </p>
        <p className="text-xs text-muted-foreground">
          {record.classification} · {record.source} · Updated {formatDate(record.lastUpdated)}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <label className="text-xs font-semibold text-muted-foreground" htmlFor="record-switch">
          Switch record
        </label>
        <select
          id="record-switch"
          value={record.id}
          onChange={(event) => selectRecord(event.target.value)}
          className="h-10 rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
        >
          {records.map((r) => (
            <option key={r.id} value={r.id}>
              {r.surveyNumber} — {r.village}
            </option>
          ))}
        </select>
        <Link
          to="/officer/land/$id"
          params={{ id: record.id }}
          className="inline-flex h-10 items-center gap-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Land Profile <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm font-medium text-muted-foreground">
      {message}
    </div>
  );
}

export function ScoreBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-brand-deep">
        <span>{label}</span>
        <span>{Math.round(value)}/100</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
