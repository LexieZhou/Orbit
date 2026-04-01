"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from "@/types";
import type { PersonWithInsight, RelationshipType } from "@/types";
import type { PersonConnection } from "@/lib/mock-data";
import { MOCK_USER } from "@/lib/mock-auth";

const RelationshipGraph = dynamic(
  () => import("@/components/graph/RelationshipGraph").then((m) => m.RelationshipGraph),
  { ssr: false, loading: () => <div className="h-[580px] bg-muted animate-pulse rounded-xl" /> }
);

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "friend", "family", "romantic", "coworker", "mentor",
];

export default function GraphPage() {
  const [people, setPeople] = useState<PersonWithInsight[]>([]);
  const [connections, setConnections] = useState<PersonConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/people").then((r) => r.json()),
      fetch("/api/connections").then((r) => r.json()),
    ])
      .then(([ppl, conns]) => {
        setPeople(ppl);
        setConnections(conns);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Relationship Graph</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your inner circle — including connections between the people you know. Drag nodes, scroll to zoom, hover for details.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {RELATIONSHIP_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RELATIONSHIP_COLORS[type] }} />
            <span className="text-muted-foreground">{RELATIONSHIP_LABELS[type]}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block w-6 border-t-2 border-blue-400" />
            User → Person
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-6 border-t border-dashed border-gray-400" />
            Person ↔ Person
          </span>
        </div>
      </div>

      {/* Graph */}
      {loading ? (
        <div className="h-[580px] bg-muted animate-pulse rounded-xl" />
      ) : (
        <RelationshipGraph
          people={people}
          connections={connections}
          currentUser={MOCK_USER}
        />
      )}

      {/* Tips */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center pt-1">
        <span>🖱 Drag nodes to rearrange</span>
        <span>🔍 Scroll to zoom · drag background to pan</span>
        <span>👆 Click a person to open their profile</span>
        <span>⭕ Node size = closeness score</span>
      </div>
    </div>
  );
}
