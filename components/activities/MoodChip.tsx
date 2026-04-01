"use client";

import { cn } from "@/lib/utils";
import { MOOD_LABELS } from "@/types";
import type { Mood } from "@/types";

const MOOD_EMOJI: Record<Mood, string> = {
  happy: "😄",
  relaxed: "😌",
  neutral: "😐",
  awkward: "😬",
  tired: "😴",
  conflict: "😤",
};

const MOOD_ACTIVE: Record<Mood, string> = {
  happy: "bg-amber-100 border-amber-400 text-amber-700",
  relaxed: "bg-emerald-100 border-emerald-400 text-emerald-700",
  neutral: "bg-slate-100 border-slate-400 text-slate-700",
  awkward: "bg-orange-100 border-orange-400 text-orange-700",
  tired: "bg-purple-100 border-purple-400 text-purple-700",
  conflict: "bg-rose-100 border-rose-400 text-rose-700",
};

interface MoodChipProps {
  mood: Mood;
  selected: boolean;
  onClick: () => void;
}

export function MoodChip({ mood, selected, onClick }: MoodChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border-2 text-xs font-medium transition-all",
        selected
          ? MOOD_ACTIVE[mood]
          : "border-border bg-background text-muted-foreground hover:border-muted-foreground/50"
      )}
    >
      <span className="text-lg leading-none">{MOOD_EMOJI[mood]}</span>
      <span>{MOOD_LABELS[mood]}</span>
    </button>
  );
}
