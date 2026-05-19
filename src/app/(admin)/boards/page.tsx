import { BoardsManager } from "@/components/admin/boards/BoardsManager";
import { PageHeader } from "@/components/shared/PageHeader";

export default function BoardsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Boards"
        subtitle="Manage all Pakistan exam boards"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Boards", href: "/boards" }]}
      />
      <BoardsManager />
    </div>
  );
}
