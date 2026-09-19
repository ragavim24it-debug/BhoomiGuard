import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISSUE_TYPES } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/report-issue")({
  component: ReportIssuePage,
});

function ReportIssuePage() {
  const { selectedLand, lands, selectLand, submitRequest } = useCitizen();

  const [issueType, setIssueType] = useState<string>(ISSUE_TYPES[0]);
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to report an issue.
      </div>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      window.alert("Please provide a description of the issue.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = submitRequest({
        landId: selectedLand.id,
        requestType: "Report Issue",
        issueType,
        reason: description,
        documentName: fileName || "land-claim-document.pdf",
        photoName: "field-evidence.jpg",
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
        title="Report an Issue"
        description="Submit a formal notice to the Revenue Department regarding boundary shifts, area discrepancies, or encroachment."
        icon={AlertCircle}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      {generatedId ? (
        <div className="rounded-xl border-2 border-primary/40 bg-card p-6 sm:p-8 text-center shadow-md">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-brand-deep">Issue Submitted Successfully!</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Your grievance has been logged with the Revenue Authority. A formal tracking code has been generated.
          </p>

          <div className="mt-5 inline-block rounded-xl border-2 border-primary/30 bg-secondary/50 px-6 py-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-deep">Your Request ID</span>
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
                View in My Requests <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedId(null);
                setDescription("");
                setFileName("");
              }}
            >
              Report Another Issue
            </Button>
          </div>
        </div>
      ) : (
        <Panel
          title="Submit Land Grievance"
          subtitle={`Filing issue for Survey No. ${selectedLand.survey_number} (${selectedLand.village})`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Survey Selection */}
            <div>
              <label htmlFor="issue-survey" className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Survey Number
              </label>
              <select
                id="issue-survey"
                value={selectedLand.id}
                onChange={(e) => selectLand(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
              >
                {lands.map((l) => (
                  <option key={l.id} value={l.id}>
                    Survey No. {l.survey_number} — {l.village} ({l.government_area} acres)
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Type */}
            <div>
              <label htmlFor="issue-type" className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Issue Type
              </label>
              <select
                id="issue-type"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-semibold text-brand-deep outline-none focus:border-primary"
              >
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="issue-desc" className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Description of Discrepancy
              </label>
              <textarea
                id="issue-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the discrepancy (e.g. government record shows 2.40 acres but latest survey observed 2.18 acres, or physical stone marker has moved)..."
                className="mt-1.5 w-full rounded-md border border-input bg-card p-3 text-sm text-brand-deep placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Document / Photo upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-deep">
                Supporting Photo or Document (Optional)
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-4 text-xs font-bold text-brand-deep hover:bg-muted">
                  <Upload className="size-4 text-primary" /> Choose File
                  <input type="file" onChange={handleFileChange} className="sr-only" accept="image/*,.pdf" />
                </label>
                <span className="text-xs text-muted-foreground truncate max-w-xs">
                  {fileName || "No file selected (Supports JPG, PNG, PDF)"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="hero" disabled={isSubmitting} className="h-11 px-6 font-bold">
                {isSubmitting ? "Submitting Issue…" : "Submit Issue & Generate Request ID"} <ArrowRight />
              </Button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
