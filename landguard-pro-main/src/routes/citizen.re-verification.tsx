import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, RotateCcw, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatAcres } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/re-verification")({
  component: ReVerificationPage,
});

function ReVerificationPage() {
  const { selectedLand, lands, selectLand, submitRequest } = useCitizen();

  const [reason, setReason] = useState(
    "Observed 0.22 acre area discrepancy between registered Patta and recent survey. Requesting physical boundary re-measurement.",
  );
  const [fileName, setFileName] = useState("");
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to request re-verification.
      </div>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason.trim()) {
      window.alert("Please provide the reason for re-verification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = submitRequest({
        landId: selectedLand.id,
        requestType: "Re-verification",
        reason,
        documentName: fileName || "re-verification-support.pdf",
      });

      setGeneratedId(code);
      setIsSubmitting(false);
    }, 400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Re-verification"
        description="Formal application for fresh physical field measurement and boundary verification by the Revenue Survey team."
        icon={RotateCcw}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      {generatedId ? (
        <div className="rounded-xl border-2 border-primary/40 bg-card p-6 sm:p-8 text-center shadow-md">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-brand-deep">Re-verification Request Registered!</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Your formal request has been forwarded to the District Revenue Officer and queued for surveyor assignment.
          </p>

          <div className="mt-5 inline-block rounded-xl border-2 border-primary/30 bg-secondary/50 px-6 py-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-deep">Tracking Code</span>
            <span className="block text-2xl font-black tracking-widest text-brand-deep font-mono mt-1">
              {generatedId}
            </span>
            <span className="block text-[0.7rem] text-muted-foreground mt-1">
              Survey No. {selectedLand.survey_number} · Status: <strong className="text-primary">Submitted</strong>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/citizen/requests">
              <Button variant="default" className="font-bold">
                Track Status in My Requests <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedId(null);
              }}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      ) : (
        <Panel
          title="Field Re-verification Application"
          subtitle={`Applying for physical surveyor visit for Survey No. ${selectedLand.survey_number}`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Survey Selection */}
            <div>
              <label htmlFor="reverif-survey" className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Survey Number & Location
              </label>
              <select
                id="reverif-survey"
                value={selectedLand.id}
                onChange={(e) => selectLand(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
              >
                {lands.map((l) => (
                  <option key={l.id} value={l.id}>
                    Survey No. {l.survey_number} — {l.village} (Govt Extent: {formatAcres(l.government_area)})
                  </option>
                ))}
              </select>
            </div>

            {/* Current status display */}
            <div className="rounded-lg bg-muted/40 p-3.5 text-xs grid sm:grid-cols-3 gap-2 border border-border/70">
              <div>
                <span className="text-muted-foreground font-semibold">Government Area:</span>
                <p className="font-extrabold text-brand-deep">{formatAcres(selectedLand.government_area)}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Surveyed Area:</span>
                <p className="font-extrabold text-brand-deep">{formatAcres(selectedLand.surveyed_area)}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Current Status:</span>
                <p className="font-extrabold text-brand-bright">{selectedLand.verification_status}</p>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reverif-reason" className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Reason for Re-verification Request
              </label>
              <textarea
                id="reverif-reason"
                rows={4}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why field re-survey is required..."
                className="mt-1.5 w-full rounded-md border border-input bg-card p-3 text-sm text-brand-deep placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Supporting Document */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Supporting Patta / Sale Deed Copy (Optional)
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-4 text-xs font-bold text-brand-deep hover:bg-muted">
                  <Upload className="size-4 text-primary" /> Choose Document
                  <input type="file" onChange={handleFileChange} className="sr-only" accept=".pdf,image/*" />
                </label>
                <span className="text-xs text-muted-foreground truncate max-w-xs">
                  {fileName || "No document chosen (PDF, JPG accepted)"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="hero" disabled={isSubmitting} className="h-11 px-6 font-bold">
                {isSubmitting ? "Submitting Request…" : "Submit Re-verification Request"} <ArrowRight />
              </Button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
