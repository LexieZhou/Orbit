export const dynamic = "force-dynamic";

import { MOCK_PEOPLE } from "@/lib/mock-data";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function NewActivityPage({
  searchParams,
}: {
  searchParams: { personId?: string };
}) {
  const people = MOCK_PEOPLE.map((p) => ({
    id: p.id,
    name: p.name,
    avatarUrl: p.avatarUrl,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Log Interaction" },
      ]} />
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Log an Interaction</h2>
        <p className="text-muted-foreground mt-1">
          Capture a recent moment with someone in your circle.
        </p>
      </div>
      <ActivityForm people={people} defaultPersonId={searchParams.personId} />
    </div>
  );
}
