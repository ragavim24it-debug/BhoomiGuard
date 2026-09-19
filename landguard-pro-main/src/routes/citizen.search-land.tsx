import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info, MapPin, Search } from "lucide-react";
import { useState } from "react";

import { DemoNotice, PageHeader, Panel, StatusTag } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAcres, formatDate, getLandHealth, type CitizenStatus } from "@/lib/citizen/data";
import { INITIAL_LAND_PARCELS, useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/search-land")({
  component: SearchLandPage,
});

function SearchLandPage() {
  const { lands, selectLand } = useCitizen();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  // Search through public records
  const results = INITIAL_LAND_PARCELS.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return (
      p.survey_number.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q) ||
      p.patta_number.toLowerCase().includes(q)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Land Records"
        description="Search public government survey and verification status by Survey Number, Village, or Patta Number."
        icon={Search}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <Panel title="Public Record Search" subtitle="Enter a survey number (e.g. 245/3, 247/2, 250/1, 251/4, 245/8) or village name">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g. 245/3, Kannampalayam, 1042..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              className="pl-10 h-11 bg-card"
            />
          </div>
          <Button type="submit" variant="default" className="h-11 px-6 font-bold">
            Search Records
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground items-center">
          <span className="font-semibold">Quick Searches:</span>
          {["245/3", "247/2", "250/1", "251/4", "Kannampalayam"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                setSearched(true);
              }}
              className="rounded bg-secondary px-2 py-1 text-xs font-semibold text-brand-deep hover:bg-primary/20 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </Panel>

      {searched && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-deep">
            Search Results ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No matching public land records found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((parcel) => {
                const isMyLand = lands.some((l) => l.id === parcel.id);
                const health = getLandHealth(parcel);

                return (
                  <div key={parcel.id} className="rounded-xl border border-border bg-card p-5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-brand-deep">
                            Survey No. {parcel.survey_number}
                          </span>
                          {isMyLand ? (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold text-primary flex items-center gap-1">
                              <CheckCircle2 className="size-3" /> In My Lands
                            </span>
                          ) : (
                            <span className="rounded bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
                              Public Record
                            </span>
                          )}
                        </div>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="size-3" /> {parcel.village}, {parcel.taluk}, {parcel.district} · Patta {parcel.patta_number}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusTag status={health.verification as CitizenStatus} />
                        {isMyLand && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => selectLand(parcel.id)}
                            className="h-8 text-xs font-bold"
                          >
                            Manage in Center
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
                      <div>
                        <span className="text-muted-foreground text-[0.7rem] uppercase font-semibold">Government Area</span>
                        <p className="font-bold text-brand-deep">{formatAcres(parcel.government_area)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[0.7rem] uppercase font-semibold">Latest Survey</span>
                        <p className="font-bold text-brand-deep">
                          {formatAcres(parcel.surveyed_area)} ({parcel.latest_survey_date ? formatDate(parcel.latest_survey_date) : "Pending"})
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[0.7rem] uppercase font-semibold">Boundary Status</span>
                        <p className="font-bold text-brand-deep">{parcel.boundary_status}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-secondary/50 p-4 flex items-start gap-3">
        <Info className="size-5 shrink-0 text-brand-bright mt-0.5" />
        <div className="text-xs text-brand-deep leading-relaxed">
          <p className="font-bold">Public Transparency Rule:</p>
          <p>
            This search allows checking public verification status across surveyed village lands. Detailed ownership actions, documents, and requests are available only for parcels linked to your authorized citizen profile.
          </p>
        </div>
      </div>
    </div>
  );
}
