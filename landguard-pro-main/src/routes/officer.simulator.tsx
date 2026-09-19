import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, ScoreBar, SelectedRecordBar } from "@/components/officer/shell";
import { simulateShift } from "@/lib/officer/analysis";
import { formatAcres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/officer/simulator")({
  component: Simulator,
});

const SHIFTS = [0, 0.5, 1, 2, 3];

function Simulator() {
  const { selectedRecord } = useOfficer();
  const [shift, setShift] = useState(0);
  const result = simulateShift(selectedRecord, shift);

  return (
    <>
      <PageHeader
        title="Counterfactual Simulator"
        description="Test hypothetical boundary shifts. Simulations are read-only and never modify the land record."
        icon={BarChart3}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title="Hypothetical boundary shift">
        <div className="flex flex-wrap gap-2">
          {SHIFTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShift(s)}
              className={cn(
                "h-11 min-w-20 rounded-md border px-4 text-sm font-bold transition-colors",
                shift === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-brand-deep hover:border-primary",
              )}
            >
              {s} m
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Simulated values are computed in memory only. Original survey measurements remain unchanged.
        </p>
      </Panel>

      {result.simulatedSurveyedArea === null ? (
        <EmptyState message="No surveyed area is available for this record, so boundary shifts cannot be simulated." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title={`Simulated outcome at ${shift} m`}>
            <InfoRow label="Government Area" value={formatAcres(selectedRecord.governmentArea)} />
            <InfoRow label="Recorded Surveyed Area" value={formatAcres(selectedRecord.surveyedArea)} />
            <InfoRow label="Simulated Surveyed Area" value={formatAcres(result.simulatedSurveyedArea)} />
            <InfoRow label="Simulated Area Discrepancy" value={formatAcres(Math.abs(result.areaDiscrepancy!))} />
            <InfoRow label="Simulated Difference %" value={`${result.discrepancyPercent!.toFixed(2)}%`} />
            <InfoRow label="Affected Area" value={formatAcres(result.affectedArea)} />
          </Panel>

          <Panel title="Confidence & risk impact">
            <ScoreBar label="Simulated verification confidence" value={result.confidence} />
            <InfoRow label="Confidence change" value={`${result.confidenceChange >= 0 ? "+" : ""}${result.confidenceChange} points`} />
            <InfoRow
              label="Risk direction"
              value={result.confidenceChange < 0 ? "Increased risk" : result.confidenceChange > 0 ? "Reduced risk" : "Unchanged"}
            />
            <p className="mt-3 rounded-md bg-secondary px-3 py-3 text-sm text-brand-deep">
              A {shift} m inward boundary shift would affect approximately {formatAcres(result.affectedArea)} and move verification
              confidence to {result.confidence}/100. This is a what-if indicator only.
            </p>
          </Panel>
        </div>
      )}
    </>
  );
}
