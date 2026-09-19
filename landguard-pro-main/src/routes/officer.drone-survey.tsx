import { createFileRoute } from "@tanstack/react-router";
import { Plane, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, SelectedRecordBar } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { formatAcres, formatDate } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/drone-survey")({
  component: DroneSurvey,
});

function DroneSurvey() {
  const { selectedRecord, logAction } = useOfficer();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const drone = selectedRecord.droneSurvey;

  return (
    <>
      <PageHeader title="Drone Survey" description="Drone acquisition details attached to the selected land record." icon={Plane} />
      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Acquisition details">
          {drone ? (
            <>
              <InfoRow label="Survey Date" value={formatDate(drone.date)} />
              <InfoRow label="Sensor" value={drone.sensor} />
              <InfoRow label="Ground Sample Distance" value={drone.gsd} />
              <InfoRow label="Coverage" value={drone.coverage} />
              <InfoRow label="Surveyed Area" value={formatAcres(selectedRecord.surveyedArea)} />
              <InfoRow label="Government Area" value={formatAcres(selectedRecord.governmentArea)} />
            </>
          ) : (
            <EmptyState message="No drone survey data is attached to this record from the connected data source." />
          )}
        </Panel>

        <Panel title="Upload drone data" subtitle="Accepted: orthomosaic imagery, GeoJSON, KML or CSV exports.">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".tif,.tiff,.jpg,.png,.geojson,.json,.kml,.csv"
            className="hidden"
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              if (!names.length) return;
              setUploaded((prev) => [...names, ...prev]);
              logAction(`Drone data uploaded (${names.length} file(s))`, selectedRecord.surveyNumber, "Info");
            }}
          />
          <Button type="button" variant="hero" onClick={() => inputRef.current?.click()}>
            <Upload /> Select drone files
          </Button>
          {uploaded.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {uploaded.map((name, i) => (
                <li key={`${name}-${i}`} className="border-b border-border/70 pb-2 font-medium text-brand-deep last:border-0">
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Uploaded files are queued for processing. No boundary is generated from unauthorized data.
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
