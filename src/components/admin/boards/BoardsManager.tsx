"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Grid2X2, Plus, Table2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardCard } from "@/components/admin/boards/BoardCard";
import { BoardsTable } from "@/components/admin/boards/BoardsTable";
import { useDeleteBoard } from "@/hooks/admin/mutations/useDeleteBoard";
import { useGetAdminBoards } from "@/hooks/admin/queries/useGetAdminBoards";
import type { AdminBoardFilters } from "@/src/types/action-types";
import { cn } from "@/lib/utils";
import type { AdminBoard } from "./types";

const provinceTabs = ["All", "Federal", "Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB"] as const;

function toAdminBoard(board: NonNullable<ReturnType<typeof useGetAdminBoards>["data"]>["data"][number]): AdminBoard & { paperCount: number } {
  return {
    id: board.id,
    name: board.name,
    shortName: board.shortName,
    description: board.description ?? "",
    province: board.province === "Gilgit_Baltistan" ? "Gilgit-Baltistan" : board.province,
    classes: [9, 10, 11, 12],
    color: board.color,
    websiteUrl: board.websiteUrl ?? "",
    status: board.isActive ? "active" : "inactive",
    paperCount: board._count.papers,
  };
}

export function BoardsManager() {
  const [province, setProvince] = useState<(typeof provinceTabs)[number]>("All");
  const [view, setView] = useState<"table" | "grid">("table");
  const [filters, setFilters] = useState<AdminBoardFilters>({
    page: 1,
    pageSize: 20,
  });
  const { data, isLoading } = useGetAdminBoards(filters);
  const deleteBoard = useDeleteBoard();

  const filteredBoards = useMemo(
    () => (data?.data ?? []).map(toAdminBoard),
    [data],
  );

  function updateProvince(tab: (typeof provinceTabs)[number]) {
    setProvince(tab);
    setFilters((current) => ({
      ...current,
      page: 1,
      province:
        tab === "All"
          ? undefined
          : tab === "GB"
            ? "Gilgit_Baltistan"
            : tab,
    }));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {provinceTabs.map((tab) => (
            <Button key={tab} type="button" size="sm" variant={province === tab ? "default" : "outline"} onClick={() => updateProvince(tab)}>
              {tab}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>
            <Table2 className="size-4" /> Table view
          </Button>
          <Button type="button" size="sm" variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}>
            <Grid2X2 className="size-4" /> Card grid
          </Button>
          <Link href="/boards/new" className={cn(buttonVariants({ size: "sm" }), "bg-ps-coral hover:bg-ps-coral/90")}>
            <Plus className="size-4" /> Add board
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2 rounded-lg border bg-card p-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : view === "table" ? (
        <BoardsTable
          boards={filteredBoards}
          totalPages={data?.totalPages ?? 1}
          page={data?.page ?? 1}
          onDelete={(id) => deleteBoard.mutate({ id })}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              paperCount={board.paperCount}
              onDelete={() => deleteBoard.mutate({ id: board.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
