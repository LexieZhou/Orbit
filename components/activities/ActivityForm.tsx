"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoodChip } from "./MoodChip";
import { ACTIVITY_LABELS, ACTIVITY_ICONS } from "@/types";
import type { ActivityType, Mood, InitiatedBy } from "@/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  personId: z.string().min(1, "Please select a person"),
  activityType: z.enum(["coffee", "dinner", "chat", "call", "work_meeting", "trip", "date", "event"] as const),
  date: z.string().min(1, "Please select a date"),
  locationName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mood: z.enum(["happy", "relaxed", "neutral", "awkward", "tired", "conflict"] as const),
  initiatedBy: z.enum(["me", "them", "mutual"] as const),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface ActivityFormProps {
  people: Person[];
  defaultPersonId?: string;
  // Edit mode
  activityId?: string;
  editInitialValues?: Partial<FormValues>;
}

const ACTIVITY_TYPES: ActivityType[] = [
  "coffee", "dinner", "chat", "call", "work_meeting", "trip", "date", "event",
];

const MOODS: Mood[] = ["happy", "relaxed", "neutral", "awkward", "tired", "conflict"];

const INITIATED_BY_OPTIONS: { value: InitiatedBy; label: string; desc: string }[] = [
  { value: "me", label: "Me", desc: "I reached out" },
  { value: "them", label: "Them", desc: "They reached out" },
  { value: "mutual", label: "Mutual", desc: "Both / organic" },
];

export function ActivityForm({ people, defaultPersonId, activityId, editInitialValues }: ActivityFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const isEditing = !!activityId;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      personId: editInitialValues?.personId ?? defaultPersonId ?? "",
      activityType: editInitialValues?.activityType ?? "coffee",
      date: editInitialValues?.date ?? format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      mood: editInitialValues?.mood ?? "neutral",
      initiatedBy: editInitialValues?.initiatedBy ?? "mutual",
      notes: editInitialValues?.notes ?? "",
      locationName: editInitialValues?.locationName ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const url = isEditing ? `/api/activities/${activityId}` : "/api/activities";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        date: new Date(values.date).toISOString(),
      }),
    });

    if (!res.ok) {
      alert(`Failed to ${isEditing ? "update" : "save"} activity. Please try again.`);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      const personId = values.personId;
      router.push(`/people/${personId}`);
      router.refresh();
    }, 1200);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold">
          {isEditing ? "Changes saved!" : "Interaction logged!"}
        </h3>
        <p className="text-muted-foreground text-sm">Redirecting to person profile…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Person */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Who did you interact with?</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="personId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.personId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a person…" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.personId && (
            <p className="text-xs text-destructive mt-1">{errors.personId.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Type + Date */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">What was the interaction?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activity Type */}
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <Controller
              name="activityType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.onChange(type)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 rounded-lg border-2 text-xs font-medium transition-all",
                        field.value === type
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      )}
                    >
                      <span className="text-lg">{ACTIVITY_ICONS[type]}</span>
                      <span>{ACTIVITY_LABELS[type]}</span>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">
              <CalendarIcon className="h-3.5 w-3.5 inline mr-1" />
              Date & Time
            </Label>
            <Input
              id="date"
              type="datetime-local"
              {...register("date")}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">
            <MapPin className="h-4 w-4 inline mr-1.5" />
            Where did it happen?
          </CardTitle>
          <CardDescription>Optional — helps build your memory map.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g. La Colombe, Nolita or just NYC"
            {...register("locationName")}
          />
        </CardContent>
      </Card>

      {/* Mood */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">How did it feel?</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {MOODS.map((mood) => (
                  <MoodChip
                    key={mood}
                    mood={mood}
                    selected={field.value === mood}
                    onClick={() => field.onChange(mood)}
                  />
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Initiated By */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Who initiated?</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="initiatedBy"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                {INITIATED_BY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 transition-all",
                      field.value === opt.value
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground/50"
                    )}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Any notes or memories?</CardTitle>
          <CardDescription>What happened? How did you leave things?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="We talked about her new project idea, grabbed coffee at our usual spot…"
            rows={4}
            {...register("notes")}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : isEditing ? (
          "Save Changes"
        ) : (
          "Log Interaction"
        )}
      </Button>
    </form>
  );
}
