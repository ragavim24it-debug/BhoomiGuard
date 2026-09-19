import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { useEffect } from "react";

import { PageHeader, Panel, ScoreBar, SelectedRecordBar, Tag } from "@/components/officer/shell";
import { getEvidenceAnalysis } from "@/lib/officer/analysis";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/evidence-conflict")({
  component: EvidenceConflict,
});

const stateTone = (state: string) => (state === "MATCH" ? "good" : state === "CONFLICT" ? "bad" : "muted") as "good" | "bad" | "muted";

function EvidenceConflict() {
  const { selectedRecord, logAction } = useOfficer();
  const e = getEvidenceAnalysis(selectedRecord);

  useEffect(() => {
    logAction("Evidence analysis completed", selectedRecord.surveyNumber, "Info");
  }, [selectedRecord.surveyNumber, logAction]);

  return (
    <>
      <PageHeader
        title="Evidence Conflict Intelligence"
        description="Cross-checks the government record against drone, RTK, GIS and historical evidence."
        icon={Scale}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title="Evidence comparison">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Result</th>
                <th className="px-3 py-3">Observed</th>
                <th className="px-3 py-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {e.rows.map((row) => (
                <tr key={row.source} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-bold text-brand-deep">{row.source}</td>
                  <td className="px-3 py-3">
                    <Tag tone={stateTone(row.state)}>{row.state}</Tag>
                  </td>
                  <td className="px-3 py-3">{row.observed}</td>
                  <td className="px-3 py-3 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Evidence confidence">
          <ScoreBar label="Evidence agreement" value={e.confidence} />
          <p className="mt-4 text-sm text-muted-foreground">
            {e.matches} matching · {e.conflicts} conflicting · {e.unavailable} unavailable
          </p>
          <p className="mt-3 rounded-md bg-secondary px-3 py-3 text-sm text-brand-deep">{e.explanation}</p>
        </Panel>

        <Panel title="Supporting & conflicting evidence">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supporting</p>
          <ul className="mt-2 space-y-1 text-sm font-medium text-brand-deep">
            {e.supporting.length ? e.supporting.map((s) => <li key={s}>{s}</li>) : <li className="text-muted-foreground">None</li>}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conflicting</p>
          <ul className="mt-2 space-y-1 text-sm font-medium text-destructive">
            {e.conflicting.length ? e.conflicting.map((s) => <li key={s}>{s}</li>) : <li className="text-muted-foreground">None</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
