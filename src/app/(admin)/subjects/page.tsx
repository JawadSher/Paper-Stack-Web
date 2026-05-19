import { SubjectsManager } from "@/components/admin/subjects/SubjectsManager";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage subjects available per class"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Subjects", href: "/subjects" }]}
      />
      <SubjectsManager />
    </div>
  );
}
