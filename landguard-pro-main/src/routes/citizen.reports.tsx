import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { useState } from "react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatAcres, formatDate, getAreaComparison, getLandHealth, publicSummary } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/reports")({
  component: CitizenReportsPage,
});

function CitizenReportsPage() {
  const { selectedLand, currentProfile } = useCitizen();
  const [printing, setPrinting] = useState(false);

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view reports.
      </div>
    );
  }

  const comparison = getAreaComparison(selectedLand);
  const health = getLandHealth(selectedLand);
  const summaryText = publicSummary(selectedLand);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Citizen Land Reports"
          description="Downloadable and printable verification summary certificates for authorized land holdings."
          icon={FileText}
        />
        <Button variant="default" size="sm" onClick={handlePrint} className="font-bold gap-1.5">
          <Printer className="size-4" /> Print / Export Report
        </Button>
      </div>

      <SelectedLandBar />

      {/* Printable Report Certificate Card */}
      <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 sm:p-10 shadow-sm print:border-none print:shadow-none space-y-8">
        {/* Certificate Header */}
        <div className="border-b-2 border-brand-deep/20 pb-6 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            GOVERNMENT OF TAMIL NADU · REVENUE & LAND SURVEY DEPARTMENT
          </span>
          <h2 className="mt-2 text-2xl font-black text-brand-deep sm:text-3xl">
            Land Verification Status Certificate
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Digital Survey & Cadastral Verification Extract · BhoomiGuard System
          </p>
          <div className="mt-3 inline-block rounded bg-secondary px-3 py-1 text-xs font-mono font-bold text-brand-deep">
            CERT-BG-2026-{selectedLand.survey_number.replace("/", "-")} · {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* Certificate Citizen & Land Details */}
        <div className="grid gap-6 sm:grid-cols-2 text-xs">
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
            <h3 className="font-extrabold text-brand-deep uppercase tracking-wider text-[0.7rem]">
              Registered Landholder
            </h3>
            <p className="text-sm font-bold text-brand-deep">{currentProfile?.full_name}</p>
            <p className="text-muted-foreground">Email: {currentProfile?.email}</p>
            <p className="text-muted-foreground">Village: {currentProfile?.village}</p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
            <h3 className="font-extrabold text-brand-deep uppercase tracking-wider text-[0.7rem]">
              Land Parcel Particulars
            </h3>
            <p className="text-sm font-bold text-brand-deep">Survey No. {selectedLand.survey_number}</p>
            <p className="text-muted-foreground">
              {selectedLand.village}, {selectedLand.taluk}, {selectedLand.district}
            </p>
            <p className="text-muted-foreground">Patta No: {selectedLand.patta_number} · Sub-div: {selectedLand.sub_division}</p>
          </div>
        </div>

        {/* Measurement Facts Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep">
            Certified Measurement Metrics
          </h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="p-3 font-bold">Metric Parameter</th>
                  <th className="p-3 font-bold">Government Record</th>
                  <th className="p-3 font-bold">Latest Digital Survey</th>
                  <th className="p-3 font-bold">Variance Observed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-bold text-brand-deep">Total Area</td>
                  <td className="p-3 font-mono">{formatAcres(selectedLand.government_area)}</td>
                  <td className="p-3 font-mono font-bold text-brand-deep">{formatAcres(selectedLand.surveyed_area)}</td>
                  <td className="p-3 font-mono font-bold text-destructive">
                    {comparison.difference !== null ? `${comparison.difference.toFixed(2)} acres (${comparison.percent?.toFixed(2)}%)` : "—"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-deep">Boundary Alignment</td>
                  <td className="p-3 text-muted-foreground">Cadastral Baseline</td>
                  <td className="p-3 font-bold text-brand-deep">{selectedLand.boundary_status}</td>
                  <td className="p-3 font-mono font-bold text-brand-deep">
                    {selectedLand.boundary_displacement !== null ? `${selectedLand.boundary_displacement} m displacement` : "None"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-deep">Verification Status</td>
                  <td className="p-3 text-muted-foreground">Recorded</td>
                  <td className="p-3 font-bold text-brand-bright">{selectedLand.verification_status}</td>
                  <td className="p-3 text-muted-foreground">
                    {selectedLand.verification_status === "Verified" ? "Compliant" : "Follow-up Required"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Public Summary Box */}
        <div className="rounded-xl border border-primary/20 bg-secondary/40 p-4 text-xs space-y-1">
          <span className="font-extrabold text-brand-deep uppercase tracking-wider text-[0.65rem]">
            Official Summary
          </span>
          <p className="text-brand-deep leading-relaxed font-medium">{summaryText}</p>
        </div>

        {/* Certificate Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[0.7rem] text-muted-foreground">
          <div>
            <p className="font-bold text-brand-deep">Authorized by Digital Land Record Gateway</p>
            <p>Verification Hash: SHA256:8f92a0194... · BHOOMIGUARD TAMIL NADU</p>
          </div>
          <div className="text-right">
            <DemoNotice text="DEMO DATA — NOT A COURT ADMISSIBLE RECORD" />
          </div>
        </div>
      </div>
    </div>
  );
}
