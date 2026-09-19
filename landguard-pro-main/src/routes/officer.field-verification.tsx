import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { InfoRow, PageHeader, Panel, SelectedRecordBar, Tag, statusTone } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, type FieldStatus } from "@/lib/officer/data";
import { useFieldVerification, useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/field-verification")({
  component: FieldVerification,
});

const STATUSES: FieldStatus[] = ["Pending", "In Progress", "Verified", "Needs Review"];

function FieldVerification() {
  const { selectedRecord, submitFieldVerification } = useOfficer();
  const existing = useFieldVerification(selectedRecord.surveyNumber);

  const [gps, setGps] = useState(`${selectedRecord.approxCenter[0]}, ${selectedRecord.approxCenter[1]}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<FieldStatus>("Verified");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gps.trim() || !date) {
      setError("GPS coordinates and survey date are required.");
      return;
    }
    setError(null);
    submitFieldVerification({ gps: gps.trim(), date, photoName, remarks: remarks.trim(), status });
    setSaved(true);
  };

  return (
    <>
      <PageHeader
        title="Field Verification"
        description="Record on-site verification for the selected land record. Submission updates the record and the audit trail."
        icon={ClipboardCheck}
      />
      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Field verification entry">
          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">GPS coordinates</span>
              <Input value={gps} onChange={(e) => setGps(e.target.value)} placeholder="Latitude, Longitude" className="mt-1 h-11" required />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Survey date</span>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-11" required />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Field photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
                className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-deep"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Remarks</span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Observations recorded on site"
                className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FieldStatus)}
                className="mt-1 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
            {saved ? <p className="text-sm font-semibold text-primary">Field verification saved and audit entry created.</p> : null}

            <Button type="submit" variant="hero" className="h-11 w-full">
              Submit field verification
            </Button>
          </form>
        </Panel>

        <Panel title="Current field verification">
          {existing ? (
            <>
              <InfoRow label="Status" value={<Tag tone={statusTone(existing.status)}>{existing.status}</Tag>} />
              <InfoRow label="Survey Date" value={formatDate(existing.date)} />
              <InfoRow label="GPS" value={existing.gps} />
              <InfoRow label="Field Photo" value={existing.photoName ?? "Not attached"} />
              <InfoRow label="Officer" value={existing.officer} />
              <InfoRow label="Record Status" value={<Tag tone={statusTone(selectedRecord.status)}>{selectedRecord.status}</Tag>} />
              <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-sm text-brand-deep">{existing.remarks || "No remarks recorded."}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No field verification has been recorded for Survey No. {selectedRecord.surveyNumber} yet.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
