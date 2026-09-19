import { useEffect, useRef } from "react";

import type { LandParcel } from "@/lib/citizen/data";

/**
 * Citizen Land Map component.
 * Uses Leaflet + OpenStreetMap base map for citizen location orientation.
 */
export function CitizenLandMap({ land }: { land: LandParcel }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const center: [number, number] = [Number(land.latitude), Number(land.longitude)];

      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(center, 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Circle marker for parcel center
      L.circleMarker(center, {
        radius: 9,
        color: "#166534",
        weight: 2.5,
        fillColor: "#22c55e",
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
            <strong style="color: #166534; font-size: 14px;">Survey No. ${land.survey_number}</strong><br/>
            ${land.village}, ${land.taluk}<br/>
            <strong>Govt Area:</strong> ${land.government_area} acres<br/>
            <strong>Latest Survey:</strong> ${land.surveyed_area ?? "—"} acres<br/>
            <strong>Status:</strong> ${land.verification_status}
          </div>`,
        )
        .openPopup();

      // Soft circular indicator representing approx boundary radius
      L.circle(center, {
        radius: 120,
        color: "#166534",
        weight: 1.5,
        dashArray: "4, 4",
        fillColor: "#22c55e",
        fillOpacity: 0.12,
      }).addTo(map);

      setTimeout(() => map.invalidateSize(), 200);
      cleanup = () => map.remove();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [land]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-md border border-border"
      role="application"
      aria-label="Citizen Land Map"
    />
  );
}

export default CitizenLandMap;
