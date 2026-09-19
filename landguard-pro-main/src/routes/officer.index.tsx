import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ClipboardCheck,
  Database,
  LayoutDashboard,
  ListOrdered,
  ScanSearch,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { EmptyState, InfoRow, PageHeader, Panel, ScoreBar, SelectedRecordBar, StatCard, Tag, statusTone } from "@/components/officer/shell";
import { getConfidence, getDiscrepancy, getPriority, getRisk } from "@/lib/officer/analysis";
import { formatAcres, formatDate, formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/")({
  component: OfficerDashboard,
});

function OfficerDashboard() {
  const { records, selectedRecord, fieldVerifications, audit } = useOfficer();

  const total = records.length;
  const verified = records.filter((r) => r.status === "Verified").length;
  const pending = records.filter((r) => r.status === "Pending Verification").length;
  const discrepancies = records.filter((r) => getDiscrepancy(r).status.includes("Discrepancy")).length;
  const highPriority = records.filter((r) => ["High", "Urgent"].includes(getPriority(r).level)).length;
  const fieldPending = records.filter((r) => {
    const fv = fieldVerifications.find((f) => f.surveyNumber === r.surveyNumber);
    const risk = getRisk(r);
    return (!fv || fv.status !== "Verified") && risk.level !== "Low";
  }).length;

  const discrepancy = getDiscrepancy(selectedRecord);
  const confidence = getConfidence(selectedRecord);
  const priority = getPriority(selectedRecord);

  return (
    <>
      <PageHeader
        title="Officer Dashboard"
        description="Live totals calculated from the shared land-record dataset used by every module in this portal."
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Land Records" value={total} hint="Records in the connected dataset" icon={Database} />
        <StatCard label="Verified Lands" value={verified} hint="Status marked Verified" icon={ShieldCheck} />
        <StatCard label="Pending Verification" value={pending} hint="Awaiting officer verification" icon={Timer} />
        <StatCard label="Discrepancies" value={discrepancies} hint="Area or boundary mismatch detected" icon={ScanSearch} />
        <StatCard label="High Priority Cases" value={highPriority} hint="Priority engine: High or Urgent" icon={ListOrdered} />
        <StatCard label="Field Verification Pending" value={fieldPending} hint="Risk flagged, field visit not closed" icon={ClipboardCheck} />
      </div>

      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Selected record summary" subtitle="Every module below reads this same record.">
          <InfoRow label="Survey Number" value={selectedRecord.surveyNumber} />
          <InfoRow label="Government Area" value={formatAcres(selectedRecord.governmentArea)} />
          <InfoRow label="Surveyed Area" value={formatAcres(selectedRecord.surveyedArea)} />
          <InfoRow label="Area Difference" value={discrepancy.difference === null ? "—" : formatAcres(Math.abs(discrepancy.difference))} />
          <InfoRow
            label="Difference %"
            value={discrepancy.differencePercent === null ? "—" : `${discrepancy.differencePercent.toFixed(2)}%`}
          />
          <InfoRow label="Boundary Displacement" value={formatMetres(selectedRecord.boundaryDisplacement)} />
          <InfoRow label="Status" value={<Tag tone={statusTone(selectedRecord.status)}>{selectedRecord.status}</Tag>} />
          <InfoRow label="Last Updated" value={formatDate(selectedRecord.lastUpdated)} />
        </Panel>

        <Panel title="Verification confidence" subtitle="Weighted from area, boundary, RTK, evidence and freshness.">
          <p className="text-4xl font-extrabold text-brand-deep">
            {confidence.score}
            <span className="text-lg text-muted-foreground">/100</span>
          </p>
          <div className="mt-2">
            <Tag tone={statusTone(confidence.level)}>{confidence.level} confidence</Tag>
          </div>
          <div className="mt-4 space-y-3">
            {confidence.factors.map((f) => (
              <ScoreBar key={f.label} label={f.label} value={f.score} />
            ))}
          </div>
        </Panel>

        <Panel title="Priority & next action" subtitle="Indicator only — not a legal determination.">
          <p className="text-4xl font-extrabold text-brand-deep">
            {priority.score}
            <span className="text-lg text-muted-foreground">/100</span>
          </p>
          <div className="mt-2">
            <Tag tone={statusTone(priority.level)}>{priority.level} priority</Tag>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-brand-deep">
            {priority.reasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                {reason}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-brand-deep">{priority.action}</p>
          <Link to="/officer/priority" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Open Priority Engine →
          </Link>
        </Panel>
      </div>

      <Panel title="Recent officer activity" subtitle="Mirrors the Audit Trail module.">
        {audit.length === 0 ? (
          <EmptyState message="No officer actions recorded in this session yet." />
        ) : (
          <ul className="divide-y divide-border text-sm">
            {audit.slice(0, 6).map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="font-semibold text-brand-deep">{entry.action}</span>
                <span className="text-xs text-muted-foreground">
                  {entry.surveyNumber} · {new Date(entry.timestamp).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
