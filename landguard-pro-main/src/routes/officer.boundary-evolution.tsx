import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

import { EmptyState, InfoRow, PageHeader, Panel, SelectedRecordBar } from "@/components/officer/shell";
import { getBoundaryTrend } from "@/lib/officer/analysis";
import { formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/boundary-evolution")({
  component: BoundaryEvolution,
});

function BoundaryEvolution() {
  const { selectedRecord } = useOfficer();
  const history = selectedRecord.historicalBoundary;
  const trend = getBoundaryTrend(selectedRecord);
  const max = Math.max(1, ...history.map((h) => h.displacement));

  return (
    <>
      <PageHeader
        title="Boundary Evolution"
        description="Historical boundary displacement recorded for the selected land record."
        icon={History}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title="Displacement timeline" subtitle="Displacement measured against the recorded boundary position.">
        {history.length === 0 ? (
          <EmptyState message="No historical boundary series available for this record." />
        ) : (
          <>
            <div className="flex h-56 items-end gap-6 border-b border-l border-border px-4 pb-2">
              {history.map((point) => (
                <div key={point.year} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-bold text-brand-deep">{formatMetres(point.displacement)}</span>
                  <div
                    className="w-full max-w-16 rounded-t-md bg-primary"
                    style={{ height: `${(point.displacement / max) * 100}%` }}
                    aria-label={`${point.year}: ${point.displacement} metres`}
                  />
                  <span className="text-xs font-semibold text-muted-foreground">{point.year}</span>
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {history.map((point, i) => {
                const prev = history[i - 1];
                const delta = prev ? point.displacement - prev.displacement : null;
                return (
                  <li key={point.year} className="flex items-center justify-between border-b border-border/70 pb-2 last:border-0">
                    <span className="font-semibold text-brand-deep">{point.year}</span>
                    <span>{formatMetres(point.displacement)}</span>
                    <span className="text-xs text-muted-foreground">
                      {delta === null ? "Baseline epoch" : `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} m vs ${prev!.year}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>

      <Panel title="Trend">
        <InfoRow label="Movement direction" value={trend.trend} />
        <InfoRow label="Average rate" value={trend.ratePerYear === null ? "—" : `${trend.ratePerYear.toFixed(3)} m / year`} />
        <InfoRow label="Latest displacement" value={formatMetres(selectedRecord.boundaryDisplacement)} />
      </Panel>
    </>
  );
}
