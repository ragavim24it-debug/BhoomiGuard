import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";

import { InfoRow, PageHeader, Panel, ScoreBar, SelectedRecordBar, Tag, statusTone } from "@/components/officer/shell";
import { getConfidence } from "@/lib/officer/analysis";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/confidence")({
  component: VerificationConfidence,
});

function VerificationConfidence() {
  const { selectedRecord } = useOfficer();
  const c = getConfidence(selectedRecord);

  return (
    <>
      <PageHeader
        title="Verification Confidence"
        description="A 0–100 score combining area consistency, boundary consistency, RTK confidence, evidence agreement and record freshness."
        icon={Gauge}
      />
      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall confidence</p>
          <p className="mt-2 text-5xl font-extrabold text-brand-deep">
            {c.score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <div className="mt-3">
            <Tag tone={statusTone(c.level)}>{c.level} confidence</Tag>
          </div>
        </Panel>

        <Panel title="Contributing factors">
          <div className="space-y-4">
            {c.factors.map((f) => (
              <div key={f.label}>
                <ScoreBar label={`${f.label} (weight ${Math.round(f.weight * 100)}%)`} value={f.score} />
                <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Score breakdown">
        {c.factors.map((f) => (
          <InfoRow
            key={f.label}
            label={f.label}
            value={`${Math.round(f.score)}/100 × ${Math.round(f.weight * 100)}% = ${(f.score * f.weight).toFixed(1)}`}
          />
        ))}
        <InfoRow label="Total" value={`${c.score}/100`} />
      </Panel>
    </>
  );
}
