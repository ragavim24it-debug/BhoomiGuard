import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  Layers,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { DemoNotice, PageHeader, Panel, StatCard, StatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { explainMyLand, formatAcres, formatDate, getAreaComparison, getLandHealth } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/")({
  component: CitizenDashboard,
});

function CitizenDashboard() {
  const { lands, selectedLand, selectLand, requests, notifications, unreadNotificationCount } = useCitizen();

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No authorized land records found for this account.</p>
      </div>
    );
  }

  const comparison = getAreaComparison(selectedLand);
  const health = getLandHealth(selectedLand);
  const explanations = explainMyLand(selectedLand);
  const activeRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Completed");

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        title="Citizen Dashboard"
        description="Transparent view of your government land record and latest digital verification data."
        icon={Sparkles}
      />

      {/* 5 Compact Dashboard Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="My Lands"
          value={`${lands.length} Parcel${lands.length > 1 ? "s" : ""}`}
          hint={lands.map((l) => l.survey_number).join(", ")}
          icon={Home}
        />
        <StatCard
          label="Verification Status"
          value={selectedLand.verification_status}
          hint={`Boundary: ${selectedLand.boundary_status}`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Latest Survey"
          value={formatAcres(selectedLand.surveyed_area)}
          hint={selectedLand.latest_survey_date ? `Survey Date: ${formatDate(selectedLand.latest_survey_date)}` : "Pending"}
          icon={Layers}
        />
        <StatCard
          label="Active Requests"
          value={activeRequests.length.toString()}
          hint={activeRequests.length ? `Latest: ${activeRequests[0].request_code}` : "None pending"}
          icon={FileCheck2}
        />
        <StatCard
          label="Notifications"
          value={unreadNotificationCount.toString()}
          hint={`${notifications.length} total updates`}
          icon={Bell}
        />
      </div>

      {/* MAIN FEATURE: MY LAND VERIFICATION CENTER */}
      <section aria-labelledby="verification-center-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="verification-center-title" className="text-xl font-extrabold text-brand-deep">
              My Land Verification Center
            </h2>
            <p className="text-xs text-muted-foreground">
              Official comparison between Revenue Record of Rights and latest drone/RTK survey.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lands.length > 1 && (
              <select
                aria-label="Switch land parcel"
                value={selectedLand.id}
                onChange={(e) => selectLand(e.target.value)}
                className="h-9 rounded-md border border-input bg-card px-2.5 text-xs font-bold text-brand-deep focus:border-primary outline-none"
              >
                {lands.map((l) => (
                  <option key={l.id} value={l.id}>
                    Survey No. {l.survey_number} ({l.village})
                  </option>
                ))}
              </select>
            )}
            <DemoNotice text="DEMO DATA" />
          </div>
        </div>

        {/* Compact Land Summary Card */}
        <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-sm transition-all">
          <div className="bg-brand-deep px-5 py-3.5 text-primary-foreground">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-soft">
                  Land Verification Summary
                </span>
                <h3 className="text-lg font-extrabold sm:text-xl">
                  Survey No: {selectedLand.survey_number}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-secondary/20 px-2.5 py-1 text-xs font-semibold text-brand-soft">
                  <MapPin className="size-3" /> {selectedLand.village}, {selectedLand.taluk}
                </span>
                <span className="rounded bg-brand-bright/20 px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-primary-foreground border border-brand-bright/30">
                  DEMO DATA
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Government Area</p>
                <p className="mt-1 text-2xl font-black text-brand-deep">
                  {formatAcres(selectedLand.government_area)}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">Record of Rights (Patta)</p>
              </div>

              <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest Survey</p>
                <p className="mt-1 text-2xl font-black text-brand-deep">
                  {formatAcres(selectedLand.surveyed_area)}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">
                  Survey Date: {selectedLand.latest_survey_date ? formatDate(selectedLand.latest_survey_date) : "Pending"}
                </p>
              </div>

              <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difference</p>
                <p className="mt-1 text-2xl font-black text-destructive">
                  {comparison.difference !== null ? `${comparison.difference.toFixed(2)} acres` : "—"}
                </p>
                <p className="text-[0.7rem] font-medium text-destructive">
                  {comparison.percent !== null ? `${comparison.percent.toFixed(2)}% variation` : "No discrepancy"}
                </p>
              </div>

              <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification</p>
                <div className="mt-2">
                  <StatusTag status={health.verification} />
                </div>
                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                  Boundary: <span className="font-semibold text-brand-deep">{selectedLand.boundary_status}</span>
                </p>
              </div>
            </div>

            {/* Citizen-friendly explanation banner */}
            <div className="rounded-lg border border-primary/20 bg-secondary/50 p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="size-5 shrink-0 text-brand-bright mt-0.5" />
                <div className="space-y-1 text-sm text-brand-deep leading-relaxed">
                  <p className="font-bold">Summary Explanation for Survey {selectedLand.survey_number}:</p>
                  <p>{explanations[0]}</p>
                  {explanations[1] && <p className="text-xs text-muted-foreground">{explanations[1]}</p>}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/citizen/report-issue">
                <Button variant="default" className="h-10 gap-1.5 font-bold">
                  <AlertCircle className="size-4" /> Report Issue
                </Button>
              </Link>
              <Link to="/citizen/re-verification">
                <Button variant="secondary" className="h-10 gap-1.5 font-bold border border-primary/20">
                  <RotateCcw className="size-4 text-brand-bright" /> Request Re-verification
                </Button>
              </Link>
              <Link to="/citizen/map">
                <Button variant="outline" className="h-10 gap-1.5 font-semibold">
                  <MapPin className="size-4 text-primary" /> View on Map
                </Button>
              </Link>
              <Link to="/citizen/documents" className="ml-auto">
                <Button variant="ghost" className="h-10 gap-1 text-xs font-bold text-primary hover:text-brand-bright">
                  <FileText className="size-3.5" /> View Public Records <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Clean Auxiliary Panels: Health Overview & Recent Requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Land Health Assessment"
          subtitle="Simple overview of your land's recorded integrity"
          action={
            <Link to="/citizen/land-health" className="text-xs font-bold text-primary hover:underline">
              Full details &rarr;
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <span className="text-sm font-semibold text-brand-deep">Area Status</span>
              <StatusTag status={health.area} />
            </div>
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <span className="text-sm font-semibold text-brand-deep">Boundary Status</span>
              <StatusTag status={health.boundary} />
            </div>
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <span className="text-sm font-semibold text-brand-deep">Verification Status</span>
              <StatusTag status={health.verification} />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-extrabold text-brand-deep">Overall Status</span>
              <StatusTag status={health.overall} />
            </div>
          </div>
        </Panel>

        <Panel
          title="Active Requests"
          subtitle="Your recent submissions regarding this land parcel"
          action={
            <Link to="/citizen/requests" className="text-xs font-bold text-primary hover:underline">
              All requests &rarr;
            </Link>
          }
        >
          {requests.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No active requests for this parcel.</p>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-brand-deep">{req.request_code}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[0.65rem] font-bold text-primary">
                        {req.request_type}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground truncate max-w-[240px]">{req.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.65rem] font-bold text-amber-900">
                      {req.status}
                    </span>
                    <p className="mt-1 text-[0.65rem] text-muted-foreground">{formatDate(req.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
