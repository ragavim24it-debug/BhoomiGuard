import { createFileRoute } from "@tanstack/react-router";
import { FileText, Printer } from "lucide-react";
import { useState } from "react";

import { DemoBanner, InfoRow, PageHeader, Panel, SelectedRecordBar, Tag, statusTone } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { getBoundaryTrend, getConfidence, getDiscrepancy, getEvidenceAnalysis, getPriority } from "@/lib/officer/analysis";
import { formatAcres, formatDate, formatMetres } from "@/lib/officer/data";
import { useFieldVerification, useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/reports")({
  component: Reports,
});

function Reports() {
  const { selectedRecord, officerId, logAction } = useOfficer();
  const [generated, setGenerated] = useState(false);
  const fv = useFieldVerification(selectedRecord.surveyNumber);

  const d = getDiscrepancy(selectedRecord);
  const e = getEvidenceAnalysis(selectedRecord);
  const c = getConfidence(selectedRecord);
  const p = getPriority(selectedRecord);
  const trend = getBoundaryTrend(selectedRecord);

  return (
    <>
      <PageHeader
        title="Reports"
        description="Verification report compiled from the selected land record and its available analysis."
        icon={FileText}
        actions={
          <>
            <Button
              type="button"
              variant="hero"
              onClick={() => {
                setGenerated(true);
                logAction("Report generated", selectedRecord.surveyNumber);
              }}
            >
              <FileText /> Generate report
            </Button>
            {generated ? (
              <Button type="button" variant="heroOutline" onClick={() => window.print()}>
                <Printer /> Print / Save as PDF
              </Button>
            ) : null}
          </>
        }
      />
      <SelectedRecordBar record={selectedRecord} />

      {!generated ? (
        <Panel>
          <p className="text-sm text-muted-foreground">
            Select a record and choose “Generate report” to compile the verification report for Survey No. {selectedRecord.surveyNumber}.
          </p>
        </Panel>
      ) : (
        <Panel title={`Verification Report — Survey No. ${selectedRecord.surveyNumber}`} subtitle={`Prepared by ${officerId} on ${formatDate(new Date().toISOString())}`}>
          <DemoBanner className="mb-4" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-deep">Record identification</h3>
              <InfoRow label="Survey Number" value={selectedRecord.surveyNumber} />
              <InfoRow label="Sub-Division" value={selectedRecord.subDivision} />
              <InfoRow label="Patta Number" value={selectedRecord.pattaNumber} />
              <InfoRow label="Location" value={`${selectedRecord.village}, ${selectedRecord.taluk}, ${selectedRecord.district}`} />
              <InfoRow label="Classification" value={selectedRecord.classification} />
              <InfoRow label="Source" value={selectedRecord.source} />
              <InfoRow label="Last Updated" value={formatDate(selectedRecord.lastUpdated)} />

              <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-brand-deep">Measurements</h3>
              <InfoRow label="Government Area" value={formatAcres(selectedRecord.governmentArea)} />
              <InfoRow label="Surveyed Area" value={formatAcres(selectedRecord.surveyedArea)} />
              <InfoRow label="Difference" value={d.difference === null ? "—" : formatAcres(Math.abs(d.difference))} />
              <InfoRow label="Difference %" value={d.differencePercent === null ? "—" : `${d.differencePercent.toFixed(2)}%`} />
              <InfoRow label="Boundary Displacement" value={formatMetres(selectedRecord.boundaryDisplacement)} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-deep">Analysis</h3>
              <InfoRow label="AI Discrepancy" value={<Tag tone={statusTone(d.status)}>{d.status}</Tag>} />
              <InfoRow label="Evidence Conflict" value={`${e.matches} match / ${e.conflicts} conflict / ${e.unavailable} unavailable`} />
              <InfoRow label="Evidence Confidence" value={`${e.confidence}/100`} />
              <InfoRow label="Boundary Evolution" value={trend.trend} />
              <InfoRow label="Verification Confidence" value={`${c.score}/100 (${c.level})`} />
              <InfoRow label="Priority" value={<Tag tone={statusTone(p.level)}>{`${p.level} · ${p.score}/100`}</Tag>} />
              <InfoRow label="Recommended Action" value={p.action} />

              <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-brand-deep">Field verification</h3>
              <InfoRow label="Field Status" value={fv ? <Tag tone={statusTone(fv.status)}>{fv.status}</Tag> : "Not recorded"} />
              <InfoRow label="Survey Date" value={fv ? formatDate(fv.date) : "—"} />
              <InfoRow label="GPS" value={fv?.gps ?? "—"} />
              <InfoRow label="Officer Remarks" value={fv?.remarks || "—"} />
              <InfoRow label="Verifying Officer" value={fv?.officer ?? officerId ?? "—"} />
            </div>
          </div>

          <p className="mt-6 rounded-md bg-secondary px-3 py-3 text-sm text-brand-deep">{e.explanation}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            This report is an analytical indicator compiled from demo data. It is not a government record and makes no legal ownership or
            dispute determination.
          </p>
        </Panel>
      )}
    </>
  );
}
