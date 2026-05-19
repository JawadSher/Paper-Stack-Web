import { notFound } from "next/navigation";
import { BoardForm } from "@/components/admin/boards/BoardForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { adminBoards } from "@/constants/admin-boards";
import { mockPapers } from "@/constants/papers";

export type EditBoardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBoardPage({ params }: EditBoardPageProps) {
  const { id } = await params;
  const board = adminBoards.find((item) => item.id === id);
  if (!board) notFound();
  const paperCount = mockPapers.filter((paper) => paper.boardId === board.id).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit board"
        subtitle={board.name}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Boards", href: "/boards" }, { label: "Edit", href: `/boards/${board.id}/edit` }]}
      />
      <BoardForm mode="edit" initialBoard={board} paperCount={paperCount} />
    </div>
  );
}
