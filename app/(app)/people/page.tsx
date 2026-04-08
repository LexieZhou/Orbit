"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, X } from "lucide-react";
import { PersonCard } from "@/components/people/PersonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PersonWithInsight, RelationshipType } from "@/types";
import { RELATIONSHIP_LABELS } from "@/types";
import { cn } from "@/lib/utils";

const FILTER_TABS: { value: RelationshipType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "friend", label: "Friends" },
  { value: "family", label: "Family" },
  { value: "romantic", label: "Romantic" },
  { value: "coworker", label: "Coworkers" },
  { value: "mentor", label: "Mentors" },
];

const REL_TYPES = Object.entries(RELATIONSHIP_LABELS) as [RelationshipType, string][];

const DEFAULT_FORM = { name: "", relationshipType: "friend" as RelationshipType, notes: "" };

export default function PeoplePage() {
  const [people, setPeople] = useState<PersonWithInsight[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RelationshipType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then((data) => { setPeople(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPerson = () => {
    if (!form.name.trim()) return;
    const newPerson: PersonWithInsight = {
      id: `person-custom-${Date.now()}`,
      name: form.name.trim(),
      relationshipType: form.relationshipType,
      notes: form.notes || null,
      avatarUrl: null,
      birthday: null,
      location: null,
      occupation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-1",
      relationshipInsight: null,
    };
    setPeople((prev) => [newPerson, ...prev]);
    setForm(DEFAULT_FORM);
    setAddOpen(false);
  };

  const filtered = people.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.relationshipType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Circle</h2>
          <p className="text-muted-foreground mt-1">
            {people.length} {people.length === 1 ? "person" : "people"} in your orbit
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add People
        </Button>
      </div>

      {/* ── Add People modal ── */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAddOpen(false)}
          />
          {/* Panel */}
          <div className="relative z-10 bg-card border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Close */}
            <button
              onClick={() => setAddOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-bold text-lg mb-1">Add Someone New</h3>
            <p className="text-sm text-muted-foreground mb-5">Add a person to your orbit and start tracking your connection.</p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Alex Chen"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddPerson(); }}
                  autoFocus
                />
              </div>

              {/* Relationship type */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Relationship Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {REL_TYPES.map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setForm((f) => ({ ...f, relationshipType: value }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                        form.relationshipType === value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Notes <span className="text-muted-foreground/60">(optional)</span>
                </label>
                <textarea
                  placeholder="How did you meet? What do you want to remember?"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full text-sm bg-muted rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setForm(DEFAULT_FORM); setAddOpen(false); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                disabled={!form.name.trim()}
                onClick={handleAddPerson}
              >
                <UserPlus className="h-4 w-4" />
                Add to Orbit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                filter === tab.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">No people found</p>
          <p className="text-sm mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
