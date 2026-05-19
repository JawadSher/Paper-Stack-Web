import { ClassesManager } from "@/components/admin/classes/ClassesManager";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class levels"
        subtitle="Configure class levels and their board assignments"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Classes", href: "/classes" }]}
      />
      <ClassesManager />
    </div>
  );
}
