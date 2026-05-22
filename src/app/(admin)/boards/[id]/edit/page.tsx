"use client";

import { useParams } from "next/navigation";
import { BoardForm } from "@/components/admin/boards/BoardForm";
import type { AdminBoard } from "@/components/admin/boards/types";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetAdminBoardById } from "@/hooks/admin/queries/useGetAdminBoardById";
import type { ClassLevel } from "@/types";

export default function EditBoardPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: board, isLoading } = useGetAdminBoardById(id);

  const initialBoard: AdminBoard | undefined = board
    ? {
        id: board.id,
        name: board.name,
        shortName: board.shortName,
        description: board.description ?? "",
        province:
          board.province === "Gilgit_Baltistan"
            ? "Gilgit-Baltistan"
            : board.province,
        classes: board.classes as ClassLevel[],
        color: board.color,
        websiteUrl: board.websiteUrl ?? "",
        status: board.isActive ? "active" : "inactive",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit board"
        subtitle={initialBoard?.name ?? "Loading board"}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Boards", href: "/boards" },
          { label: "Edit", href: `/boards/${id}/edit` },
        ]}
      />
      {isLoading ? (
        <SkeletonCard />
      ) : initialBoard ? (
        <BoardForm
          mode="edit"
          initialBoard={initialBoard}
          paperCount={board?._count.papers ?? 0}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Board not found.</p>
      )}
    </div>
  );
}
