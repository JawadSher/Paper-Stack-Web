import { BoardForm } from "@/components/admin/boards/BoardForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewBoardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add board"
        subtitle="Create a new exam board profile"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Boards", href: "/boards" }, { label: "New", href: "/boards/new" }]}
      />
      <BoardForm mode="create" />
    </div>
  );
}
