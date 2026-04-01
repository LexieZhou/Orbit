"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOOD_LABELS, MOOD_COLORS } from "@/types";
import type { ActivityWithPerson } from "@/types";
import type { Mood } from "@prisma/client";
import { cn } from "@/lib/utils";

// Dynamic import — Leaflet needs client-only environment
const MemoryMap = dynamic(
  () => import("@/components/map/MemoryMap").then((m) => m.MemoryMap),
  { ssr: false, loading: () => <div className="h-[520px] bg-muted animate-pulse rounded-xl" /> }
);

export default function MapPage() {
  const [activities, setActivities] = useState<ActivityWithPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [personFilter, setPersonFilter] = useState<string>("all");
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");

  useEffect(() => {
    fetch("/api/activities?limit=200")
      .then((r) => r.json())
      .then((data) => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Unique people from activities
  const people = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    activities.forEach((a) => map.set(a.person.id, { id: a.person.id, name: a.person.name }));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [activities]);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (personFilter !== "all" && a.personId !== personFilter) return false;
      if (moodFilter !== "all" && a.mood !== moodFilter) return false;
      return true;
    });
  }, [activities, personFilter, moodFilter]);

  const withLocation = filtered.filter((a) => a.latitude != null);
  const moods: Mood[] = ["happy", "relaxed", "neutral", "awkward", "tired", "conflict"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Memory Map</h2>
        <p className="text-muted-foreground mt-1">
          Every place you&apos;ve shared a moment — mapped.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={personFilter} onValueChange={setPersonFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All people" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All people</SelectItem>
            {people.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setMoodFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              moodFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border"
            )}
          >
            All moods
          </button>
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setMoodFilter(mood === moodFilter ? "all" : mood)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-colors",
                moodFilter === mood ? "text-white" : "bg-background text-muted-foreground border-border"
              )}
              style={
                moodFilter === mood
                  ? { backgroundColor: MOOD_COLORS[mood], borderColor: MOOD_COLORS[mood] }
                  : {}
              }
            >
              {MOOD_LABELS[mood]}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground ml-auto">
          {withLocation.length} location{withLocation.length !== 1 ? "s" : ""} shown
        </span>
      </div>

      {/* Map */}
      {loading ? (
        <div className="h-[520px] bg-muted animate-pulse rounded-xl" />
      ) : (
        <MemoryMap activities={filtered} height="520px" />
      )}

      {/* Location legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {moods.map((mood) => (
          <div key={mood} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: MOOD_COLORS[mood] }}
            />
            <span>{MOOD_LABELS[mood]} — marker color</span>
          </div>
        ))}
      </div>
    </div>
  );
}
