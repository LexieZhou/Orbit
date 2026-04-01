import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDate(date: Date | string, fmt = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, fmt);
}

export function daysSince(date: Date | string | null): number | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return differenceInDays(new Date(), d);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Map a closeness score (0–100) to a human-readable label */
export function closenessLabel(score: number): string {
  if (score >= 80) return "Very Close";
  if (score >= 60) return "Close";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Distant";
  return "Fading";
}

/** Returns a CSS color class for the closeness score */
export function closenessColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-500";
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Generate a deterministic avatar color from a string */
export function avatarColorFromName(name: string): string {
  const colors = [
    "bg-rose-400",
    "bg-pink-400",
    "bg-fuchsia-400",
    "bg-purple-400",
    "bg-violet-400",
    "bg-indigo-400",
    "bg-blue-400",
    "bg-sky-400",
    "bg-cyan-400",
    "bg-teal-400",
    "bg-emerald-400",
    "bg-green-400",
    "bg-amber-400",
    "bg-orange-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Group an array of items by a key */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const group = String(item[key]);
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
