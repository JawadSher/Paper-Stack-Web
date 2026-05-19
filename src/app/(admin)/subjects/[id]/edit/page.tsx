import { notFound } from "next/navigation";
import { SubjectForm } from "@/components/admin/subjects/SubjectForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { adminSubjects } from "@/constants/admin-subjects";

export type EditSubjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSubjectPage({ params }: EditSubjectPageProps) {
  const { id } = await params;
  const subject = adminSubjects.find((item) => item.id === id);
  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit subject"
        subtitle={subject.name}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Subjects", href: "/subjects" }, { label: "Edit", href: `/subjects/${subject.id}/edit` }]}
      />
      <SubjectForm mode="edit" initialSubject={subject} />
    </div>
  );
}
