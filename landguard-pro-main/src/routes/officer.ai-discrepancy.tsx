import { createFileRoute } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { useEffect } from "react";

import { InfoRow, PageHeader, Panel, SelectedRecordBar, StatCard, Tag, statusTone } from "@/components/officer/shell";
import { getDiscrepancy } from "@/lib/officer/analysis";
import { formatAcres, formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/ai-discrepancy")({
  component: AiDiscrepancy,
});

function AiDiscrepancy() {
  const { selectedRecord, logAction } = useOfficer();
  const d = getDiscrepancy(selectedRecord);

  useEffect(() => {
    logAction("AI analysis completed", selectedRecord.surveyNumber, "Info");
  }, [selectedRecord.surveyNumber, logAction]);

  return (
    <>
      <PageHeader
        title="AI Discrepancy"
        description="Automated comparison of the government area against the surveyed area for the selected record."
        icon={ScanSearch}
      />
      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Government Area" value={formatAcres(selectedRecord.governmentArea)} icon={ScanSearch} />
        <StatCard label="Surveyed Area" value={formatAcres(selectedRecord.surveyedArea)} icon={ScanSearch} />
        <StatCard
          label="Area Difference"
          value={d.difference === null ? "—" : formatAcres(Math.abs(d.difference))}
          hint={d.differencePercent === null ? "Surveyed area unavailable" : `${d.differencePercent.toFixed(2)}% of record area`}
          icon={ScanSearch}
        />
        <StatCard label="Boundary Displacement" value={formatMetres(d.boundaryDisplacement)} icon={ScanSearch} />
      </div>

      <Panel title="Discrepancy assessment">
        <InfoRow label="Discrepancy Status" value={<Tag tone={statusTone(d.status)}>{d.status}</Tag>} />
        <InfoRow label="Difference %" value={d.differencePercent === null ? "—" : `${d.differencePercent.toFixed(2)}%`} />
        <InfoRow label="Comparison Source" value={selectedRecord.source} />
        <p className="mt-4 rounded-md bg-secondary px-3 py-3 text-sm text-brand-deep">
          {d.hasData
            ? `The surveyed area differs from the government area by ${formatAcres(Math.abs(d.difference!))} (${d.differencePercent!.toFixed(2)}%), with a measured boundary displacement of ${formatMetres(d.boundaryDisplacement)}. This is a technical indicator only and makes no ownership determination.`
            : "No surveyed area is available for this record, so no area comparison can be computed. Attach drone or RTK measurements first."}
        </p>
      </Panel>
    </>
  );
}
