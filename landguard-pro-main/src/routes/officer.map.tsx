import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon } from "lucide-react";
import { lazy, Suspense } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, SelectedRecordBar } from "@/components/officer/shell";
import { useOfficer } from "@/lib/officer/store";

const LandMap = lazy(() => import("@/components/officer/land-map"));

export const Route = createFileRoute("/officer/map")({
  component: GisMap,
});

const SUPPORTED = ["GeoJSON (.geojson / .json)", "KML (.kml)", "CSV (.csv)", "Drone outputs (orthomosaic / point cloud metadata)", "RTK / GNSS observations"];

function GisMap() {
  const { selectedRecord } = useOfficer();

  return (
    <>
      <PageHeader
        title="GIS / Land Map"
        description="OpenStreetMap is used only as a base map. Parcel boundaries are drawn only from authorized geometry."
        icon={MapIcon}
      />
      <SelectedRecordBar record={selectedRecord} />

      <Panel title="Base map" subtitle="Marker shows the approximate village location for orientation, not a parcel boundary.">
        <ClientOnly fallback={<div className="h-[420px] w-full animate-pulse rounded-md bg-muted" />}>
          <Suspense fallback={<div className="h-[420px] w-full animate-pulse rounded-md bg-muted" />}>
            <LandMap record={selectedRecord} />
          </Suspense>
        </ClientOnly>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Parcel geometry">
          {selectedRecord.boundaryGeometry ? (
            <InfoRow label="Geometry" value="Authorized parcel geometry loaded" />
          ) : (
            <EmptyState message="Parcel geometry unavailable from connected data source." />
          )}
          <InfoRow label="Survey Number" value={selectedRecord.surveyNumber} />
          <InfoRow label="Village" value={selectedRecord.village} />
          <InfoRow label="Source" value={selectedRecord.source} />
        </Panel>

        <Panel title="Supported data sources" subtitle="Import handlers are prepared for these authorized formats.">
          <ul className="space-y-2 text-sm font-medium text-brand-deep">
            {SUPPORTED.map((s) => (
              <li key={s} className="border-b border-border/70 pb-2 last:border-0">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            No parcel layer is currently connected, so no boundary is displayed.
          </p>
        </Panel>
      </div>
    </>
  );
}
