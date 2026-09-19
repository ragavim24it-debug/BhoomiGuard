import { createFileRoute } from "@tanstack/react-router";
import { Satellite, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { EmptyState, InfoRow, PageHeader, Panel, ScoreBar, SelectedRecordBar } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { formatDate, formatMetres } from "@/lib/officer/data";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/rtk")({
  component: RtkVerification,
});

function RtkVerification() {
  const { selectedRecord, logAction } = useOfficer();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const rtk = selectedRecord.rtk;

  return (
    <>
      <PageHeader title="RTK Verification" description="RTK / GNSS observations attached to the selected land record." icon={Satellite} />
      <SelectedRecordBar record={selectedRecord} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="RTK / GNSS observation">
          {rtk ? (
            <>
              <InfoRow label="Observation Date" value={formatDate(rtk.date)} />
              <InfoRow label="Receiver" value={rtk.receiver} />
              <InfoRow label="Fix Type" value={rtk.fixType} />
              <InfoRow label="Observed Points" value={rtk.points} />
              <InfoRow label="Boundary Displacement" value={formatMetres(selectedRecord.boundaryDisplacement)} />
              <div className="mt-4">
                <ScoreBar label="RTK confidence" value={rtk.confidence} />
              </div>
            </>
          ) : (
            <EmptyState message="No RTK / GNSS observation is attached to this record from the connected data source." />
          )}
        </Panel>

        <Panel title="Add RTK / GNSS data" subtitle="Accepted: CSV point files, GeoJSON or KML exports from the rover.">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".csv,.geojson,.json,.kml,.txt"
            className="hidden"
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              if (!names.length) return;
              setFiles((prev) => [...names, ...prev]);
              logAction(`RTK data added (${names.length} file(s))`, selectedRecord.surveyNumber, "Info");
            }}
          />
          <Button type="button" variant="hero" onClick={() => inputRef.current?.click()}>
            <Upload /> Select RTK files
          </Button>
          {files.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {files.map((name, i) => (
                <li key={`${name}-${i}`} className="border-b border-border/70 pb-2 font-medium text-brand-deep last:border-0">
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">Observations are stored against the selected record only.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
