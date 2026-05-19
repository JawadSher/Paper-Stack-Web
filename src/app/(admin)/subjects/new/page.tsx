import { SubjectForm } from "@/components/admin/subjects/SubjectForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewSubjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add subject"
        subtitle="Create a subject and assign it to class levels"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Subjects", href: "/subjects" }, { label: "New", href: "/subjects/new" }]}
      />
      <SubjectForm mode="create" />
    </div>
  );
}
