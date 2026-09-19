import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Info, Layers, Map as MapIcon, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";

import { DemoNotice, InfoRow, PageHeader, Panel, SelectedLandBar, StatusTag } from "@/components/citizen/shell";
import { formatAcres, formatDate, getLandHealth, type CitizenStatus } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

// Reuse existing officer Leaflet map component with adapted land record format
const CitizenLandMap = lazy(() => import("@/components/citizen/citizen-map"));

export const Route = createFileRoute("/citizen/map")({
  component: CitizenMapPage,
});

function CitizenMapPage() {
  const { selectedLand } = useCitizen();

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view on the map.
      </div>
    );
  }

  const health = getLandHealth(selectedLand);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Land Map"
        description="Interactive geographic orientation and survey location for your authorized land parcel."
        icon={MapIcon}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      <Panel
        title={`Geographic Location: Survey No. ${selectedLand.survey_number}`}
        subtitle="OpenStreetMap base map showing the approximate parcel location for citizen orientation."
      >
        <ClientOnly fallback={<div className="h-[420px] w-full animate-pulse rounded-md bg-muted" />}>
          <Suspense fallback={<div className="h-[420px] w-full animate-pulse rounded-md bg-muted" />}>
            <CitizenLandMap land={selectedLand} />
          </Suspense>
        </ClientOnly>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Land Coordinates & Classification">
          <InfoRow label="Survey Number" value={selectedLand.survey_number} />
          <InfoRow label="Sub-division" value={selectedLand.sub_division || "Main"} />
          <InfoRow label="Village / Taluk" value={`${selectedLand.village}, ${selectedLand.taluk}`} />
          <InfoRow label="District" value={selectedLand.district} />
          <InfoRow label="Approximate GPS" value={`${selectedLand.latitude.toFixed(4)}° N, ${selectedLand.longitude.toFixed(4)}° E`} />
          <InfoRow label="Classification" value={selectedLand.classification} />
        </Panel>

        <Panel title="Survey & Boundary Status">
          <InfoRow label="Government Area" value={formatAcres(selectedLand.government_area)} />
          <InfoRow label="Surveyed Area" value={formatAcres(selectedLand.surveyed_area)} />
          <InfoRow
            label="Boundary Displacement"
            value={selectedLand.boundary_displacement !== null ? `${selectedLand.boundary_displacement} m` : "None"}
          />
          <InfoRow label="Latest Survey Date" value={formatDate(selectedLand.latest_survey_date)} />
          <div className="flex items-center justify-between py-2 border-b border-border/70">
            <span className="text-sm font-semibold text-brand-deep">Verification Status</span>
            <StatusTag status={health.verification as CitizenStatus} />
          </div>
          <InfoRow label="Data Source" value={selectedLand.source} />
        </Panel>
      </div>

      <div className="rounded-lg border border-primary/20 bg-secondary/50 p-4 flex items-start gap-3">
        <Info className="size-5 shrink-0 text-brand-bright mt-0.5" />
        <div className="text-xs text-brand-deep leading-relaxed">
          <p className="font-bold">Public Mapping Standard:</p>
          <p>
            The marker indicates the approximate center of Survey No. {selectedLand.survey_number} for orientation. Precise legal cadastral boundary lines are authenticated through field re-verification by the Taluk Survey Department.
          </p>
        </div>
      </div>
    </div>
  );
}
