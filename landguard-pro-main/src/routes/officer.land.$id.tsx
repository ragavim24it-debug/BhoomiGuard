import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ClipboardCheck, FileText, FolderOpen, Map, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, ScoreBar, Tag, statusTone } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { getConfidence, getDiscrepancy, getPriority, getRisk } from "@/lib/officer/analysis";
import { formatAcres, formatDate, formatMetres } from "@/lib/officer/data";
import { useFieldVerification, useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/land/$id")({
  component: LandProfile,
});

function LandProfile() {
  const { id } = useParams({ from: "/officer/land/$id" });
  const { records, selectedRecord, selectRecord, logAction } = useOfficer();
  const navigate = useNavigate();
  const [docNotice, setDocNotice] = useState(false);

  useEffect(() => {
    if (records.some((r) => r.id === id)) selectRecord(id);
  }, [id, records, selectRecord]);

  const record = records.find((r) => r.id === id) ?? selectedRecord;
  const discrepancy = getDiscrepancy(record);
  const confidence = getConfidence(record);
  const priority = getPriority(record);
  const risk = getRisk(record);
  const fieldVerification = useFieldVerification(record.surveyNumber);

  return (
    <>
      <PageHeader
        title={`Land Profile — Survey No. ${record.surveyNumber}`}
        description={`${record.village}, ${record.taluk} Taluk, ${record.district} District`}
        icon={MapPinned}
        actions={
          <>
            <Button type="button" variant="hero" onClick={() => navigate({ to: "/officer/map" })}>
              <Map /> View Map
            </Button>
            <Button
              type="button"
              variant="heroOutline"
              onClick={() => {
                setDocNotice(true);
                logAction("Documents requested", record.surveyNumber, "Info");
              }}
            >
              <FolderOpen /> View Documents
            </Button>
            <Button type="button" variant="heroOutline" onClick={() => navigate({ to: "/officer/field-verification" })}>
              <ClipboardCheck /> Start Verification
            </Button>
          </>
        }
      />

      {docNotice ? (
        <EmptyState message="No scanned documents are attached to this record from the connected data source." />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Record of rights">
          <InfoRow label="Survey Number" value={record.surveyNumber} />
          <InfoRow label="Sub-Division" value={record.subDivision} />
          <InfoRow label="Patta Number" value={record.pattaNumber} />
          <InfoRow label="District" value={record.district} />
          <InfoRow label="Taluk" value={record.taluk} />
          <InfoRow label="Village" value={record.village} />
          <InfoRow label="Area" value={formatAcres(record.area)} />
          <InfoRow label="Classification" value={record.classification} />
          <InfoRow label="Boundary Geometry" value={record.boundaryGeometry ? "Available" : "Unavailable"} />
          <InfoRow label="Status" value={<Tag tone={statusTone(record.status)}>{record.status}</Tag>} />
          <InfoRow label="Source" value={record.source} />
          <InfoRow label="Last Updated" value={formatDate(record.lastUpdated)} />
        </Panel>

        <Panel title="Survey measurements & analysis">
          <InfoRow label="Government Area" value={formatAcres(record.governmentArea)} />
          <InfoRow label="Surveyed Area" value={formatAcres(record.surveyedArea)} />
          <InfoRow label="Area Difference" value={discrepancy.difference === null ? "—" : formatAcres(Math.abs(discrepancy.difference))} />
          <InfoRow label="Difference %" value={discrepancy.differencePercent === null ? "—" : `${discrepancy.differencePercent.toFixed(2)}%`} />
          <InfoRow label="Boundary Displacement" value={formatMetres(record.boundaryDisplacement)} />
          <InfoRow label="Discrepancy Status" value={<Tag tone={statusTone(discrepancy.status)}>{discrepancy.status}</Tag>} />
          <InfoRow label="Verification Confidence" value={`${confidence.score}/100 (${confidence.level})`} />
          <InfoRow label="Priority" value={<Tag tone={statusTone(priority.level)}>{`${priority.level} · ${priority.score}/100`}</Tag>} />
          <InfoRow label="Risk Level" value={<Tag tone={statusTone(risk.level)}>{risk.level}</Tag>} />
          <div className="mt-4 space-y-3">
            {confidence.factors.map((f) => (
              <ScoreBar key={f.label} label={f.label} value={f.score} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Historical boundary data">
          {record.historicalBoundary.length === 0 ? (
            <EmptyState message="No historical boundary series available for this record." />
          ) : (
            <ul className="space-y-2 text-sm">
              {record.historicalBoundary.map((point) => (
                <li key={point.year} className="flex items-center justify-between border-b border-border/70 pb-2 last:border-0">
                  <span className="font-semibold text-brand-deep">{point.year}</span>
                  <span>{formatMetres(point.displacement)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Field verification status">
          {fieldVerification ? (
            <>
              <InfoRow label="Status" value={<Tag tone={statusTone(fieldVerification.status)}>{fieldVerification.status}</Tag>} />
              <InfoRow label="Survey Date" value={formatDate(fieldVerification.date)} />
              <InfoRow label="GPS" value={fieldVerification.gps} />
              <InfoRow label="Field Photo" value={fieldVerification.photoName ?? "Not attached"} />
              <InfoRow label="Officer" value={fieldVerification.officer} />
              <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-sm text-brand-deep">{fieldVerification.remarks || "No remarks recorded."}</p>
            </>
          ) : (
            <EmptyState message="No field verification has been recorded for this record yet." />
          )}
          <Button type="button" variant="heroOutline" className="mt-4" onClick={() => navigate({ to: "/officer/reports" })}>
            <FileText /> Generate Report
          </Button>
        </Panel>
      </div>
    </>
  );
}
