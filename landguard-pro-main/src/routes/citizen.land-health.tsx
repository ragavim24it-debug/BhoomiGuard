import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, HeartPulse, HelpCircle, RotateCcw } from "lucide-react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar, StatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { explainMyLand, getLandHealth, type CitizenStatus } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/land-health")({
  component: LandHealthPage,
});

function LandHealthPage() {
  const { selectedLand } = useCitizen();

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view health information.
      </div>
    );
  }

  const health = getLandHealth(selectedLand);
  const explanations = explainMyLand(selectedLand);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Land Health"
        description="Clear health assessment of your land record based on boundary integrity and area alignment."
        icon={HeartPulse}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      {/* Primary Health Status Grid: Only Area, Boundary, Verification, Overall */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Area Status</p>
          <div className="mt-2">
            <StatusTag status={health.area as CitizenStatus} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {health.area === "VERIFIED"
              ? "Area matches revenue record within tolerance."
              : "Discrepancy observed between recorded and surveyed area."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Boundary Status</p>
          <div className="mt-2">
            <StatusTag status={health.boundary as CitizenStatus} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {health.boundary === "VERIFIED"
              ? "Corner coordinates verified on cadastral map."
              : "Field boundary demarcation verification required."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification Status</p>
          <div className="mt-2">
            <StatusTag status={health.verification as CitizenStatus} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {health.verification === "VERIFIED"
              ? "Survey record verified by revenue department."
              : "Requires attention or citizen re-verification request."}
          </p>
        </div>

        <div className="rounded-xl border-2 border-primary/40 bg-secondary/30 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-deep">Overall Status</p>
          <div className="mt-2">
            <StatusTag status={health.overall as CitizenStatus} />
          </div>
          <p className="mt-2 text-xs font-semibold text-brand-deep">
            {health.overall === "VERIFIED"
              ? "Healthy parcel with no reported conflicts."
              : "Action recommended for ground verification."}
          </p>
        </div>
      </div>

      {/* SECTION: EXPLAIN MY LAND */}
      <Panel
        title="Explain My Land"
        subtitle="Citizen-friendly plain-language explanation of this parcel's verification status"
      >
        <div className="rounded-xl border border-primary/20 bg-secondary/60 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="size-6 shrink-0 text-brand-bright mt-0.5" />
            <div className="space-y-3 text-sm text-brand-deep leading-relaxed">
              <p className="text-base font-extrabold text-brand-deep">
                Official Citizen Explanation for Survey No. {selectedLand.survey_number}:
              </p>
              {explanations.map((line, idx) => (
                <p key={idx} className="border-l-2 border-primary/40 pl-3">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-primary/20">
            <Link to="/citizen/re-verification">
              <Button variant="default" size="sm" className="font-bold gap-1.5">
                <RotateCcw className="size-3.5" /> Request Re-verification
              </Button>
            </Link>
            <Link to="/citizen/report-issue">
              <Button variant="outline" size="sm" className="font-bold gap-1.5">
                <AlertCircle className="size-3.5" /> Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
