import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Table2 } from "lucide-react";

import { PageHeader, Panel, Tag, statusTone } from "@/components/officer/shell";
import { getConfidence, getDiscrepancy, getPriority } from "@/lib/officer/analysis";
import { formatAcres, formatDate, formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/land-records")({
  component: LandRecords,
});

function LandRecords() {
  const { records, selectRecord, logAction } = useOfficer();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Land Records"
        description="Complete shared land-record register. All Officer modules operate on the record selected here."
        icon={Table2}
      />

      <Panel title={`Register (${records.length} records)`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                <th className="px-3 py-3">Survey / Sub-Div</th>
                <th className="px-3 py-3">Patta</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Govt. Area</th>
                <th className="px-3 py-3">Surveyed</th>
                <th className="px-3 py-3">Difference</th>
                <th className="px-3 py-3">Displacement</th>
                <th className="px-3 py-3">Confidence</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const d = getDiscrepancy(r);
                const c = getConfidence(r);
                const p = getPriority(r);
                return (
                  <tr
                    key={r.id}
                    onClick={() => {
                      selectRecord(r.id);
                      logAction("Record opened", r.surveyNumber);
                      navigate({ to: "/officer/land/$id", params: { id: r.id } });
                    }}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-3 py-3 font-bold text-brand-deep">
                      {r.surveyNumber} <span className="text-xs font-normal text-muted-foreground">/ {r.subDivision}</span>
                    </td>
                    <td className="px-3 py-3">{r.pattaNumber}</td>
                    <td className="px-3 py-3">{`${r.village}, ${r.taluk}, ${r.district}`}</td>
                    <td className="px-3 py-3">{formatAcres(r.governmentArea)}</td>
                    <td className="px-3 py-3">{formatAcres(r.surveyedArea)}</td>
                    <td className="px-3 py-3">
                      {d.differencePercent === null ? "—" : `${formatAcres(Math.abs(d.difference!))} (${d.differencePercent.toFixed(2)}%)`}
                    </td>
                    <td className="px-3 py-3">{formatMetres(r.boundaryDisplacement)}</td>
                    <td className="px-3 py-3 font-semibold">{c.score}/100</td>
                    <td className="px-3 py-3">
                      <Tag tone={statusTone(p.level)}>{p.level}</Tag>
                    </td>
                    <td className="px-3 py-3">
                      <Tag tone={statusTone(r.status)}>{r.status}</Tag>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(r.lastUpdated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
