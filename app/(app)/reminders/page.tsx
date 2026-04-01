export const dynamic = "force-dynamic";

import { getPeopleWithInsights } from "@/lib/mock-data";
import { generateReminders } from "@/lib/reminders";
import { ReminderList } from "@/components/dashboard/ReminderList";
import { Bell } from "lucide-react";

export default function RemindersPage() {
  const people = getPeopleWithInsights();
  const reminders = generateReminders(people);

  const high   = reminders.filter((r) => r.priority === "high");
  const medium = reminders.filter((r) => r.priority === "medium");
  const low    = reminders.filter((r) => r.priority === "low");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Reminders
        </h2>
        <p className="text-muted-foreground mt-1">
          Smart suggestions to help you stay connected with the people who matter.
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-5xl mb-4">✨</p>
          <p className="text-xl font-semibold">All caught up!</p>
          <p className="text-sm mt-2">Your relationships are all looking healthy right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {high.length   > 0 && <div><h3 className="text-sm font-semibold text-rose-600 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" />Needs Attention ({high.length})</h3><ReminderList reminders={high} /></div>}
          {medium.length > 0 && <div><h3 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />Worth a Nudge ({medium.length})</h3><ReminderList reminders={medium} /></div>}
          {low.length    > 0 && <div><h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />Nice to Do ({low.length})</h3><ReminderList reminders={low} /></div>}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/50 rounded-xl border">
        <p className="text-xs font-semibold mb-2">How reminders work</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <strong>Reconnect</strong> — no interaction past the threshold for your relationship type</li>
          <li>• <strong>Fading</strong> — interaction frequency has dropped significantly vs. before</li>
          <li>• <strong>Reciprocity</strong> — the other person initiates much more than you do</li>
          <li>• <strong>Memory</strong> — positive relationship that&apos;s slightly overdue for a catch-up</li>
          <li>• Thresholds vary by type (romantic: 5d, family: 14d, friend: 21d, mentor/coworker: 30d)</li>
        </ul>
      </div>
    </div>
  );
}
