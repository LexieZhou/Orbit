"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { MOOD_COLORS, MOOD_LABELS, ACTIVITY_ICONS, ACTIVITY_LABELS } from "@/types";
import type { ActivityWithPerson } from "@/types";
import type { Mood } from "@/types";
import { formatDate } from "@/lib/utils";

interface MemoryMapProps {
  activities: ActivityWithPerson[];
  height?: string;
}

interface MarkerGroup {
  lat: number;
  lng: number;
  locationName: string;
  activities: ActivityWithPerson[];
}

function groupActivitiesByLocation(activities: ActivityWithPerson[]): MarkerGroup[] {
  const map = new Map<string, MarkerGroup>();

  activities.forEach((a) => {
    if (a.latitude == null || a.longitude == null) return;
    // Round coords to ~100m precision for clustering nearby places
    const key = `${a.locationName ?? `${a.latitude.toFixed(3)},${a.longitude.toFixed(3)}`}`;
    if (!map.has(key)) {
      map.set(key, {
        lat: a.latitude,
        lng: a.longitude,
        locationName: a.locationName ?? "Unknown location",
        activities: [],
      });
    }
    map.get(key)!.activities.push(a);
  });

  return Array.from(map.values());
}

export function MemoryMap({ activities, height = "500px" }: MemoryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);
  const [selected, setSelected] = useState<MarkerGroup | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Synchronous flag to cancel async init if cleanup fires before import resolves
    let cancelled = false;

    // Destroy any existing map first (handles StrictMode double-invoke)
    if (leafletRef.current) {
      leafletRef.current.remove();
      leafletRef.current = null;
    }

    // Also clear any stale Leaflet state the DOM might carry
    const container = mapRef.current as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const groups = groupActivitiesByLocation(activities);

      // Always default to Manhattan, NYC
      const MANHATTAN: [number, number] = [40.7831, -73.9712];

      const map = L.map(mapRef.current!, {
        center: MANHATTAN,
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      groups.forEach((group) => {
        const moodCounts: Partial<Record<Mood, number>> = {};
        group.activities.forEach((a) => {
          moodCounts[a.mood] = (moodCounts[a.mood] ?? 0) + 1;
        });
        const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0][0] as Mood;
        const color = MOOD_COLORS[dominantMood];

        // Pick the emoji of the most frequent activity type in this group
        const typeCounts: Partial<Record<string, number>> = {};
        group.activities.forEach((a) => {
          typeCounts[a.activityType] = (typeCounts[a.activityType] ?? 0) + 1;
        });
        const dominantType = Object.entries(typeCounts).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0][0];
        const pinEmoji = ACTIVITY_ICONS[dominantType as keyof typeof ACTIVITY_ICONS] ?? "📍";

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 40px; height: 40px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              display: flex; align-items: center; justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 18px; line-height:1;">${pinEmoji}</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const marker = L.marker([group.lat, group.lng], { icon }).addTo(map);
        marker.on("click", () => setSelected(group));
        marker.bindTooltip(
          `<strong>${group.locationName}</strong><br/>${group.activities.length} memory${group.activities.length !== 1 ? "ies" : ""}`,
          { direction: "top", offset: [0, -30] }
        );
      });

      leafletRef.current = map;
    });

    return () => {
      cancelled = true;
      leafletRef.current?.remove();
      leafletRef.current = null;
    };
  }, [activities]);

  return (
    <div className="relative" style={{ height }}>
      {/* Import Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Side panel for selected marker */}
      {selected && (
        <div className="absolute top-4 right-4 w-72 bg-card border rounded-xl shadow-lg p-4 z-[1000] max-h-80 overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-sm">{selected.locationName}</p>
              <p className="text-xs text-muted-foreground">
                {selected.activities.length} memory{selected.activities.length !== 1 ? "ies" : ""}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {selected.activities.map((a) => (
              <Link
                key={a.id}
                href={`/activities/${a.id}/edit`}
                className="block border rounded-lg p-2.5 text-xs hover:border-primary/50 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{a.person.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">{formatDate(a.date, "MMM d")}</span>
                    <Pencil className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>{ACTIVITY_ICONS[a.activityType]}</span>
                  <span>{ACTIVITY_LABELS[a.activityType]}</span>
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: MOOD_COLORS[a.mood] + "20",
                      color: MOOD_COLORS[a.mood],
                    }}
                  >
                    {MOOD_LABELS[a.mood]}
                  </span>
                </div>
                {a.notes && <p className="mt-1 text-muted-foreground line-clamp-2">{a.notes}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state overlay */}
      {activities.filter((a) => a.latitude != null).length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 rounded-xl">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="font-medium text-sm">No locations logged yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add locations when you log interactions to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
