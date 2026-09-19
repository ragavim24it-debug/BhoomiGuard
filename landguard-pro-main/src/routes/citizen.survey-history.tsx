import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CheckCircle2, History, Layers, Navigation } from "lucide-react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar, StatusTag } from "@/components/citizen/shell";
import { formatAcres, formatDate, type CitizenStatus } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/survey-history")({
  component: SurveyHistoryPage,
});

function SurveyHistoryPage() {
  const { selectedLand, surveys } = useCitizen();

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view survey history.
      </div>
    );
  }

  // Sort surveys chronologically descending
  const sortedSurveys = [...surveys].sort(
    (a, b) => new Date(b.survey_date).getTime() - new Date(a.survey_date).getTime(),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Survey History"
        description="Chronological record of official cadastral surveys and boundary measurements for your land."
        icon={History}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      <Panel
        title={`Survey Timeline: Survey No. ${selectedLand.survey_number}`}
        subtitle="Evolution of recorded land area and boundary position over time"
      >
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:bottom-2 before:top-2 before:left-[11px] sm:before:left-[15px] before:w-0.5 before:bg-primary/30">
          {sortedSurveys.map((srv) => {
            const year = new Date(srv.survey_date).getFullYear();
            const isLatest = srv.id === sortedSurveys[0]?.id;

            return (
              <div key={srv.id} className="relative group">
                {/* Timeline node */}
                <span
                  className={`absolute -left-[23px] sm:-left-[27px] top-1 grid size-6 sm:size-7 place-items-center rounded-full border-2 bg-card text-xs font-black ${
                    isLatest
                      ? "border-primary bg-secondary text-brand-deep ring-4 ring-primary/10"
                      : "border-muted-foreground/40 text-muted-foreground"
                  }`}
                >
                  {year.toString().slice(-2)}
                </span>

                <div
                  className={`rounded-xl border p-4 sm:p-5 transition-all bg-card ${
                    isLatest ? "border-primary/60 shadow-sm" : "border-border shadow-xs"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-brand-deep">{year}</span>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold text-primary">
                        {srv.survey_type}
                      </span>
                      {isLatest && (
                        <span className="rounded bg-brand-bright/20 px-2 py-0.5 text-[0.65rem] font-bold text-brand-deep">
                          Latest Survey
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3 text-muted-foreground" /> {formatDate(srv.survey_date)}
                      </span>
                      <StatusTag status={srv.verification_status as CitizenStatus} />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-lg bg-background p-3 border border-border/70">
                      <p className="text-[0.65rem] uppercase font-bold text-muted-foreground">Surveyed Area</p>
                      <p className="mt-1 text-base font-extrabold text-brand-deep">
                        {formatAcres(srv.surveyed_area)}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">
                        Govt Record: {formatAcres(selectedLand.government_area)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background p-3 border border-border/70">
                      <p className="text-[0.65rem] uppercase font-bold text-muted-foreground">Boundary Movement</p>
                      <p className="mt-1 text-base font-extrabold text-brand-deep">
                        {srv.boundary_movement !== null ? `${srv.boundary_movement} m` : "Negligible"}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">
                        Status: {srv.boundary_status}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background p-3 border border-border/70">
                      <p className="text-[0.65rem] uppercase font-bold text-muted-foreground">Technology Used</p>
                      <p className="mt-1 text-sm font-bold text-brand-deep truncate">
                        {srv.survey_type.includes("Drone") ? "Drone + RTK GNSS" : "Ground Total Station"}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">High Precision</p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-brand-deep/90 bg-muted/30 p-2.5 rounded-md">
                    {srv.public_result}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
