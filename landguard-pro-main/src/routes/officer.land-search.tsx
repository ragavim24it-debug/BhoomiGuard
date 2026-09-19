import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, PageHeader, Panel, Tag, statusTone } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DISTRICTS, TALUKS, VILLAGES, formatAcres, formatDate } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/land-search")({
  component: LandSearch,
});

const emptyFilters = { district: "", taluk: "", village: "", surveyNumber: "", subDivision: "", pattaNumber: "" };

function LandSearch() {
  const { records, selectRecord, logAction } = useOfficer();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(emptyFilters);

  const results = useMemo(
    () =>
      records.filter(
        (r) =>
          (!filters.district || r.district === filters.district) &&
          (!filters.taluk || r.taluk === filters.taluk) &&
          (!filters.village || r.village === filters.village) &&
          (!filters.surveyNumber || r.surveyNumber.toLowerCase().includes(filters.surveyNumber.trim().toLowerCase())) &&
          (!filters.subDivision || r.subDivision.toLowerCase().includes(filters.subDivision.trim().toLowerCase())) &&
          (!filters.pattaNumber || r.pattaNumber.includes(filters.pattaNumber.trim())),
      ),
    [records, filters],
  );

  const set = (key: keyof typeof emptyFilters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const open = (id: string, surveyNumber: string) => {
    selectRecord(id);
    logAction("Record opened", surveyNumber);
    navigate({ to: "/officer/land/$id", params: { id } });
  };

  const selectClass = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-brand-deep outline-none focus:border-primary";

  return (
    <>
      <PageHeader title="Land Search" description="Search the connected land-record dataset by administrative location or record identifiers." icon={Search} />

      <Panel title="Search filters">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <select className={selectClass} value={filters.district} onChange={(e) => set("district", e.target.value)} aria-label="District">
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select className={selectClass} value={filters.taluk} onChange={(e) => set("taluk", e.target.value)} aria-label="Taluk">
            <option value="">All Taluks</option>
            {TALUKS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select className={selectClass} value={filters.village} onChange={(e) => set("village", e.target.value)} aria-label="Village">
            <option value="">All Villages</option>
            {VILLAGES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <Input className="h-11 bg-card" placeholder="Survey Number (e.g. 245/3)" value={filters.surveyNumber} onChange={(e) => set("surveyNumber", e.target.value)} />
          <Input className="h-11 bg-card" placeholder="Sub-Division" value={filters.subDivision} onChange={(e) => set("subDivision", e.target.value)} />
          <Input className="h-11 bg-card" placeholder="Patta Number" value={filters.pattaNumber} onChange={(e) => set("pattaNumber", e.target.value)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="hero" onClick={() => logAction(`Search executed (${results.length} result(s))`)}>
            <Search /> Search Records
          </Button>
          <Button type="button" variant="heroOutline" onClick={() => setFilters(emptyFilters)}>
            Reset Filters
          </Button>
        </div>
      </Panel>

      <Panel title={`Results (${results.length})`} subtitle="Click a record to open its Land Profile.">
        {results.length === 0 ? (
          <EmptyState message="No records match the selected filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                  <th className="px-3 py-3">Survey No.</th>
                  <th className="px-3 py-3">Area</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Classification</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => open(r.id, r.surveyNumber)}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-3 py-3 font-bold text-brand-deep">{r.surveyNumber}</td>
                    <td className="px-3 py-3">{formatAcres(r.area)}</td>
                    <td className="px-3 py-3">{`${r.village}, ${r.taluk}, ${r.district}`}</td>
                    <td className="px-3 py-3">{r.classification}</td>
                    <td className="px-3 py-3">
                      <Tag tone={statusTone(r.status)}>{r.status}</Tag>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.source}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(r.lastUpdated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
