import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Layers, MoveRight, RotateCcw, ShieldAlert } from "lucide-react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar, StatCard, StatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatAcres, formatDate, getAreaComparison, getLandHealth, type CitizenStatus } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/area-boundary")({
  component: AreaBoundaryPage,
});

function AreaBoundaryPage() {
  const { selectedLand } = useCitizen();

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view area and boundary details.
      </div>
    );
  }

  const comparison = getAreaComparison(selectedLand);
  const health = getLandHealth(selectedLand);
  const hasDiscrepancy = comparison.difference !== null && comparison.difference > 0.05;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Area & Boundary Status"
        description="Detailed comparison between government recorded extent and recent digital survey measurements."
        icon={Layers}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      {/* Primary Area Comparison Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Government Recorded Area"
          value={formatAcres(selectedLand.government_area)}
          hint="From Record of Rights / Patta"
          icon={CheckCircle2}
        />
        <StatCard
          label="Latest Surveyed Area"
          value={formatAcres(selectedLand.surveyed_area)}
          hint={selectedLand.latest_survey_date ? `Measured ${formatDate(selectedLand.latest_survey_date)}` : "Pending"}
          icon={Layers}
        />
        <StatCard
          label="Area Difference"
          value={comparison.difference !== null ? `${comparison.difference.toFixed(2)} acres` : "0.00 acres"}
          hint={comparison.percent !== null ? `${comparison.percent.toFixed(2)}% discrepancy` : "Exact match"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Boundary Displacement"
          value={selectedLand.boundary_displacement !== null ? `${selectedLand.boundary_displacement} m` : "0.0 m"}
          hint={`Status: ${selectedLand.boundary_status}`}
          icon={ShieldAlert}
        />
      </div>

      {/* Side-by-Side Area Breakdown */}
      <Panel
        title={`Parcel Analysis: Survey No. ${selectedLand.survey_number}`}
        subtitle="Visual breakdown of land area measurement metrics"
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-background/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Area Verification</span>
                <StatusTag status={health.area} />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Government Extent:</span>
                  <span className="font-extrabold text-brand-deep">{formatAcres(selectedLand.government_area)}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Surveyed Extent:</span>
                  <span className="font-extrabold text-brand-deep">{formatAcres(selectedLand.surveyed_area)}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Absolute Difference:</span>
                  <span className={`font-black ${hasDiscrepancy ? "text-destructive" : "text-primary"}`}>
                    {comparison.difference !== null ? `${comparison.difference.toFixed(2)} acres` : "—"}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Difference Percentage:</span>
                  <span className={`font-black ${hasDiscrepancy ? "text-destructive" : "text-primary"}`}>
                    {comparison.percent !== null ? `${comparison.percent.toFixed(2)}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Boundary Position</span>
                <StatusTag status={health.boundary} />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Physical Displacement:</span>
                  <span className="font-extrabold text-brand-deep">
                    {selectedLand.boundary_displacement !== null ? `${selectedLand.boundary_displacement} m` : "0.0 m"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Boundary Status:</span>
                  <span className="font-bold text-brand-deep">{selectedLand.boundary_status}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Survey Method:</span>
                  <span className="font-bold text-brand-deep">{selectedLand.source}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Public Accuracy:</span>
                  <span className="font-bold text-brand-bright">{selectedLand.rtk_public_accuracy || "High precision"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Boundary Displacement Table for Survey 245/3 */}
          {selectedLand.survey_number === "245/3" && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-deep">
                Historical Boundary Movement Trend
              </h4>
              <p className="text-[0.7rem] text-muted-foreground mb-3">
                Ground demarcation movement measured across government survey cycles
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2 font-bold">Survey Year</th>
                      <th className="pb-2 font-bold">Survey Type</th>
                      <th className="pb-2 font-bold">Boundary Movement</th>
                      <th className="pb-2 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-2.5 font-extrabold text-brand-deep">2015</td>
                      <td className="py-2.5 text-muted-foreground">Cadastral ETS Ground Survey</td>
                      <td className="py-2.5 font-bold text-brand-deep">0.4 m</td>
                      <td className="py-2.5"><span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-800">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-extrabold text-brand-deep">2020</td>
                      <td className="py-2.5 text-muted-foreground">Settlement Sub-division Survey</td>
                      <td className="py-2.5 font-bold text-brand-deep">0.9 m</td>
                      <td className="py-2.5"><span className="rounded bg-amber-100 px-2 py-0.5 text-[0.65rem] font-bold text-amber-800">Pending</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-extrabold text-brand-deep">2026</td>
                      <td className="py-2.5 text-muted-foreground">AI Drone Orthomosaic + RTK</td>
                      <td className="py-2.5 font-bold text-destructive">1.7 m</td>
                      <td className="py-2.5"><span className="rounded bg-rose-100 px-2 py-0.5 text-[0.65rem] font-bold text-rose-800">Attention Required</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Recommendation */}
          <div className="rounded-xl border border-primary/20 bg-secondary/40 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <h4 className="text-sm font-extrabold text-brand-deep">Notice for Citizen Landholder</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {hasDiscrepancy
                  ? "A difference exceeding 5% or 1 meter boundary displacement has been recorded. You are encouraged to request a re-verification or report an issue so a field surveyor can physically inspect the land markers."
                  : "Your latest survey measurements are consistent with the government revenue record. No immediate action is required."}
              </p>
            </div>
            {hasDiscrepancy && (
              <div className="flex gap-2">
                <Link to="/citizen/re-verification">
                  <Button variant="default" size="sm" className="font-bold gap-1">
                    <RotateCcw className="size-3.5" /> Request Re-verification
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
