import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FileCheck2, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

import { DemoNotice, PageHeader, Panel, RequestStatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/requests")({
  component: MyRequestsPage,
});

function MyRequestsPage() {
  const { requests, lands } = useCitizen();
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = requests.filter((r) => {
    if (filterType === "ALL") return true;
    return r.request_type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="My Requests"
          description="Track official verification and grievance requests submitted for your land parcels."
          icon={FileCheck2}
        />
        <div className="flex gap-2">
          <Link to="/citizen/report-issue">
            <Button variant="default" size="sm" className="font-bold gap-1">
              <Plus className="size-3.5" /> Report Issue
            </Button>
          </Link>
          <Link to="/citizen/re-verification">
            <Button variant="outline" size="sm" className="font-bold gap-1">
              <Plus className="size-3.5" /> Re-verification
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`rounded px-3 py-1 font-bold transition-colors ${
              filterType === "ALL" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-brand-deep"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Report Issue")}
            className={`rounded px-3 py-1 font-bold transition-colors ${
              filterType === "Report Issue" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-brand-deep"
            }`}
          >
            Issues
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Re-verification")}
            className={`rounded px-3 py-1 font-bold transition-colors ${
              filterType === "Re-verification" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-brand-deep"
            }`}
          >
            Re-verifications
          </button>
        </div>

        <DemoNotice text="DEMO DATA" />
      </div>

      <Panel title="Request Tracking Registry" subtitle="Live lifecycle tracking across revenue verification stages">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No requests found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-bold">Request ID</th>
                  <th className="pb-3 font-bold">Survey Number</th>
                  <th className="pb-3 font-bold">Request Type</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Latest Milestone</th>
                  <th className="pb-3 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((req) => {
                  const land = lands.find((l) => l.id === req.land_id);
                  const surveyNo = land ? land.survey_number : "245/3";

                  return (
                    <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 font-mono font-extrabold text-brand-deep">{req.request_code}</td>
                      <td className="py-3.5 font-bold text-brand-deep">
                        Survey No. {surveyNo}
                      </td>
                      <td className="py-3.5">
                        <span className="rounded bg-secondary px-2 py-0.5 text-[0.65rem] font-bold text-primary">
                          {req.request_type}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <RequestStatusTag status={req.status} />
                      </td>
                      <td className="py-3.5 text-muted-foreground max-w-xs truncate">
                        {req.latest_update}
                      </td>
                      <td className="py-3.5 text-right font-medium text-muted-foreground">
                        {formatDate(req.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
