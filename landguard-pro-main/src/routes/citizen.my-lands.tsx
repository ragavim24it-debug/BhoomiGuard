import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Home, MapPin } from "lucide-react";

import { DemoNotice, PageHeader, Panel, StatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatAcres, formatDate, getAreaComparison, getLandHealth, type CitizenStatus } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/my-lands")({
  component: MyLandsPage,
});

function MyLandsPage() {
  const { lands, selectedLand, selectLand } = useCitizen();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Authorized Lands"
        description="Authorized land holdings linked to your citizen profile. Select a parcel to manage and verify."
        icon={Home}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <div className="grid gap-5">
        {lands.map((land) => {
          const isSelected = selectedLand?.id === land.id;
          const comparison = getAreaComparison(land);
          const health = getLandHealth(land);

          return (
            <div
              key={land.id}
              className={`rounded-xl border p-5 transition-all bg-card ${
                isSelected ? "border-primary ring-1 ring-primary/30 shadow-md" : "border-border shadow-xs hover:border-primary/50"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary font-black text-sm">
                    {land.survey_number}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-brand-deep">
                      Survey No. {land.survey_number} (Sub-div: {land.sub_division})
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 text-brand-bright" /> {land.village}, {land.taluk}, {land.district} · Patta No. {land.patta_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusTag status={health.verification as CitizenStatus} />
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      <CheckCircle2 className="size-3.5" /> Active Selection
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectLand(land.id)}
                      className="h-8 text-xs font-semibold"
                    >
                      Set Active
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[0.65rem]">Recorded Area (Govt)</p>
                  <p className="mt-0.5 text-base font-bold text-brand-deep">{formatAcres(land.government_area)}</p>
                  <p className="text-[0.65rem] text-muted-foreground">{land.classification}</p>
                </div>

                <div className="rounded-md bg-muted/40 p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[0.65rem]">Latest Surveyed Area</p>
                  <p className="mt-0.5 text-base font-bold text-brand-deep">{formatAcres(land.surveyed_area)}</p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {land.latest_survey_date ? `Date: ${formatDate(land.latest_survey_date)}` : "Pending"}
                  </p>
                </div>

                <div className="rounded-md bg-muted/40 p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[0.65rem]">Difference Observed</p>
                  <p className={`mt-0.5 text-base font-bold ${comparison.difference && comparison.difference > 0.05 ? "text-destructive" : "text-brand-deep"}`}>
                    {comparison.difference !== null ? `${comparison.difference.toFixed(2)} acres` : "—"}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {comparison.percent ? `${comparison.percent.toFixed(2)}% difference` : "Consistent with record"}
                  </p>
                </div>

                <div className="rounded-md bg-muted/40 p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[0.65rem]">Boundary Status</p>
                  <p className="mt-0.5 text-base font-bold text-brand-deep">{land.boundary_status}</p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    Displacement: {land.boundary_displacement !== null ? `${land.boundary_displacement} m` : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-muted-foreground">
                  Source: <span className="font-semibold text-brand-deep">{land.source}</span> · Last verified: {formatDate(land.last_updated)}
                </p>
                <div className="flex items-center gap-2">
                  <Link to="/citizen/area-boundary" onClick={() => selectLand(land.id)}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary">
                      Area Details <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                  <Link to="/citizen/map" onClick={() => selectLand(land.id)}>
                    <Button variant="secondary" size="sm" className="h-8 text-xs font-bold">
                      View Map
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Panel title="Security & Authorization Notice">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Under BhoomiGuard security standards, citizens can only view government land parcels for which they hold verified ownership or patta authorization. Internal department metrics, predictive intelligence, and other citizens' holdings are strictly segregated.
        </p>
      </Panel>
    </div>
  );
}
