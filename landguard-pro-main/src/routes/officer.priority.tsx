import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListOrdered } from "lucide-react";

import { InfoRow, PageHeader, Panel, ScoreBar, SelectedRecordBar, Tag, statusTone } from "@/components/officer/shell";
import { getPriority } from "@/lib/officer/analysis";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/priority")({
  component: PriorityEngine,
});

function PriorityEngine() {
  const { records, selectedRecord, selectRecord } = useOfficer();
  const navigate = useNavigate();
  const priority = getPriority(selectedRecord);
  const queue = records.map((r) => ({ record: r, priority: getPriority(r) })).sort((a, b) => b.priority.score - a.priority.score);

  return (
    <>
      <PageHeader
        title="Priority Engine"
        description="Verification priority derived from discrepancy, boundary movement, evidence conflict and risk indicators."
        icon={ListOrdered}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title={`Priority for Survey No. ${selectedRecord.surveyNumber}`}>
        <ScoreBar label="Priority score" value={priority.score} />
        <div className="mt-4">
          <InfoRow label="Priority Level" value={<Tag tone={statusTone(priority.level)}>{priority.level}</Tag>} />
          <InfoRow label="Recommended Action" value={priority.action} />
        </div>
        <ul className="mt-4 space-y-2 text-sm font-medium text-brand-deep">
          {priority.reasons.map((reason) => (
            <li key={reason} className="border-b border-border/70 pb-2 last:border-0">
              {reason}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Verification queue">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Survey No.</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Level</th>
                <th className="px-3 py-3">Recommended action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(({ record, priority: p }, i) => (
                <tr
                  key={record.id}
                  onClick={() => {
                    selectRecord(record.id);
                    navigate({ to: "/officer/land/$id", params: { id: record.id } });
                  }}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-3 py-3 font-bold text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-3 font-bold text-brand-deep">{record.surveyNumber}</td>
                  <td className="px-3 py-3">{`${record.village}, ${record.taluk}`}</td>
                  <td className="px-3 py-3 font-semibold">{p.score}/100</td>
                  <td className="px-3 py-3">
                    <Tag tone={statusTone(p.level)}>{p.level}</Tag>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{p.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
