import { UploadPaperForm } from "@/components/admin/papers/UploadPaperForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewPaperPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload new paper"
        subtitle="Add a PDF and complete the paper metadata."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Papers", href: "/papers" },
          { label: "New", href: "/papers/new" },
        ]}
      />
      <UploadPaperForm />
    </div>
  );
}
