import { notFound } from "next/navigation";
import { EditPaperForm } from "@/components/admin/papers/EditPaperForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { adminPapers } from "@/constants/admin-papers";

export type EditPaperPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPaperPage({ params }: EditPaperPageProps) {
  const { id } = await params;
  const paper = adminPapers.find((item) => item.id === id);
  if (!paper) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit paper"
        subtitle={paper.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Papers", href: "/papers" },
          { label: "Edit", href: `/papers/${paper.id}/edit` },
        ]}
      />
      <EditPaperForm paper={paper} />
    </div>
  );
}
