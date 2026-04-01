export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getActivityById } from "@/lib/mock-data";
import { MOCK_PEOPLE } from "@/lib/mock-data";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ACTIVITY_ICONS, ACTIVITY_LABELS } from "@/types";

export default function EditActivityPage({
  params,
}: {
  params: { id: string };
}) {
  const activity = getActivityById(params.id);
  if (!activity) notFound();

  const people = MOCK_PEOPLE.map((p) => ({
    id: p.id,
    name: p.name,
    avatarUrl: p.avatarUrl,
  }));

  const editInitialValues = {
    personId: activity.personId,
    activityType: activity.activityType,
    date: format(new Date(activity.date), "yyyy-MM-dd'T'HH:mm"),
    locationName: activity.locationName ?? "",
    latitude: activity.latitude ?? undefined,
    longitude: activity.longitude ?? undefined,
    mood: activity.mood,
    initiatedBy: activity.initiatedBy,
    notes: activity.notes ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb
        items={[
          { label: "People", href: "/people" },
          { label: activity.person.name, href: `/people/${activity.personId}` },
          { label: "Edit Interaction" },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">
            {ACTIVITY_ICONS[activity.activityType]}
          </span>
          <h2 className="text-2xl font-bold">Edit Interaction</h2>
        </div>
        <p className="text-muted-foreground">
          {ACTIVITY_LABELS[activity.activityType]} with{" "}
          <span className="font-medium text-foreground">{activity.person.name}</span>
          {activity.locationName && (
            <>
              {" "}at{" "}
              <span className="font-medium text-foreground">{activity.locationName}</span>
            </>
          )}
        </p>
      </div>

      <ActivityForm
        people={people}
        activityId={activity.id}
        editInitialValues={editInitialValues}
      />
    </div>
  );
}
