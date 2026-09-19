import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";

import { EmptyState, PageHeader, Panel, SelectedRecordBar, Tag } from "@/components/officer/shell";
import { formatAcres, formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/cross-parcel")({
  component: CrossParcel,
});

function CrossParcel() {
  const { selectedRecord } = useOfficer();
  const relations = selectedRecord.crossParcel;

  return (
    <>
      <PageHeader
        title="Cross-Parcel Analysis"
        description="Relationships between the selected record and adjoining parcels, shown only where supporting data exists."
        icon={Compass}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title={`Adjoining parcels (${relations.length})`}>
        {relations.length === 0 ? (
          <EmptyState message="No adjoining-parcel measurements are available for this record." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                  <th className="px-3 py-3">Adjoining Survey No.</th>
                  <th className="px-3 py-3">Overlap</th>
                  <th className="px-3 py-3">Gap</th>
                  <th className="px-3 py-3">Boundary Crossing</th>
                  <th className="px-3 py-3">Shared Boundary Movement</th>
                  <th className="px-3 py-3">Observation</th>
                </tr>
              </thead>
              <tbody>
                {relations.map((r) => (
                  <tr key={r.surveyNumber} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 font-bold text-brand-deep">{r.surveyNumber}</td>
                    <td className="px-3 py-3">{r.overlap > 0 ? formatAcres(r.overlap) : "None"}</td>
                    <td className="px-3 py-3">{r.gap > 0 ? formatAcres(r.gap) : "None"}</td>
                    <td className="px-3 py-3">
                      <Tag tone={r.crossing ? "bad" : "good"}>{r.crossing ? "Crossing detected" : "No crossing"}</Tag>
                    </td>
                    <td className="px-3 py-3">{formatMetres(r.sharedBoundaryMovement)}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {r.overlap > 0
                        ? "Overlapping extent requires joint field verification."
                        : r.gap > 0
                          ? "Unassigned gap between parcels detected."
                          : "Shared boundary movement observed only."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Indicators are derived from measured survey data only; they make no ownership or legal boundary determination.
        </p>
      </Panel>
    </>
  );
}
