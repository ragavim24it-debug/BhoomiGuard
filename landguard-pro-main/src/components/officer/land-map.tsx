import { useEffect, useRef } from "react";

import type { LandRecord } from "@/lib/officer/data";

/**
 * Leaflet + OpenStreetMap base map.
 * OSM is used ONLY as the base map. No cadastral boundary is drawn:
 * parcel geometry is rendered only when an authorized source supplies it.
 */
export function LandMap({ record }: { record: LandRecord }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(record.approxCenter, 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.circleMarker(record.approxCenter, {
        radius: 8,
        color: "#166534",
        weight: 2,
        fillColor: "#22c55e",
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(
          `<strong>Survey No. ${record.surveyNumber}</strong><br/>${record.village}, ${record.taluk}<br/>Approximate village location only — not a parcel boundary.`,
        );

      if (record.boundaryGeometry) {
        L.geoJSON(record.boundaryGeometry as never, { style: { color: "#166534", weight: 2, fillOpacity: 0.1 } }).addTo(map);
      }

      setTimeout(() => map.invalidateSize(), 200);
      cleanup = () => map.remove();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [record]);

  return <div ref={containerRef} className="h-[420px] w-full rounded-md border border-border" role="application" aria-label="Land base map" />;
}

export default LandMap;
