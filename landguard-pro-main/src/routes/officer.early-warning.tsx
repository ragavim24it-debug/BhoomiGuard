import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { InfoRow, PageHeader, Panel, SelectedRecordBar, Tag, statusTone } from "@/components/officer/shell";
import { getRisk } from "@/lib/officer/analysis";
import { formatAcres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/early-warning")({
  component: EarlyWarning,
});

function EarlyWarning() {
  const { records, selectedRecord, selectRecord } = useOfficer();
  const navigate = useNavigate();
  const ranked = records
    .map((r) => ({ record: r, risk: getRisk(r) }))
    .sort((a, b) => b.risk.score - a.risk.score);
  const risk = getRisk(selectedRecord);

  return (
    <>
      <PageHeader
        title="Dispute Early Warning"
        description="Early-warning indicators only. This module makes no legal ownership or dispute determination."
        icon={AlertTriangle}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title={`Selected record — Survey No. ${selectedRecord.surveyNumber}`}>
        <InfoRow label="Risk Level" value={<Tag tone={statusTone(risk.level)}>{`${risk.level} · ${risk.score}/100`}</Tag>} />
        <InfoRow label="Affected Area" value={risk.affectedArea === null ? "—" : formatAcres(risk.affectedArea)} />
        <InfoRow label="Recommended Action" value={risk.recommendation} />
        <ul className="mt-4 space-y-2 text-sm font-medium text-brand-deep">
          {risk.reasons.map((reason) => (
            <li key={reason} className="border-b border-border/70 pb-2 last:border-0">
              {reason}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="All records by risk">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                <th className="px-3 py-3">Survey No.</th>
                <th className="px-3 py-3">Village</th>
                <th className="px-3 py-3">Risk</th>
                <th className="px-3 py-3">Primary reason</th>
                <th className="px-3 py-3">Affected area</th>
                <th className="px-3 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map(({ record, risk: r }) => (
                <tr
                  key={record.id}
                  onClick={() => {
                    selectRecord(record.id);
                    navigate({ to: "/officer/land/$id", params: { id: record.id } });
                  }}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-3 py-3 font-bold text-brand-deep">{record.surveyNumber}</td>
                  <td className="px-3 py-3">{record.village}</td>
                  <td className="px-3 py-3">
                    <Tag tone={statusTone(r.level)}>{`${r.level} · ${r.score}`}</Tag>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.reasons[0]}</td>
                  <td className="px-3 py-3">{r.affectedArea === null ? "—" : formatAcres(r.affectedArea)}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
