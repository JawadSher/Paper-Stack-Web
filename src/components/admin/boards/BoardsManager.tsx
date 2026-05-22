"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2X2, Plus, Table2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardCard } from "@/components/admin/boards/BoardCard";
import { BoardsTable } from "@/components/admin/boards/BoardsTable";
import { useDeleteBoard } from "@/hooks/admin/mutations/useDeleteBoard";
import { useGetAdminBoards } from "@/hooks/admin/queries/useGetAdminBoards";
import type { AdminBoardFilters } from "@/src/types/action-types";
import { cn } from "@/lib/utils";
import type { ClassLevel } from "@/types";
import type { AdminBoard } from "./types";

const provinceTabs = ["All", "Federal", "Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB"] as const;

function toAdminBoard(board: NonNullable<ReturnType<typeof useGetAdminBoards>["data"]>["data"][number]): AdminBoard & { paperCount: number } {
  return {
    id: board.id,
    name: board.name,
    shortName: board.shortName,
    description: board.description ?? "",
    province: board.province === "Gilgit_Baltistan" ? "Gilgit-Baltistan" : board.province,
    classes: board.classes as ClassLevel[],
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
  console.log(data);
  const deleteBoard = useDeleteBoard();

  const filteredBoards = useMemo(
    () => (data?.data ?? []).map(toAdminBoard),
    [data],
  );
  const currentPage = data?.page ?? filters.page ?? 1;
  const pageSize = data?.pageSize ?? filters.pageSize ?? 20;
  const totalBoards = data?.total ?? filteredBoards.length;
  const totalPages = Math.max(data?.totalPages ?? 1, 1);
  const from = filteredBoards.length ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min(totalBoards, (currentPage - 1) * pageSize + filteredBoards.length);

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

  function updatePage(page: number) {
    setFilters((current) => ({
      ...current,
      page,
      pageSize: 20,
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
          total={data?.total ?? filteredBoards.length}
          totalPages={data?.totalPages ?? 1}
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? 20}
          onPageChange={updatePage}
          onDelete={(id) => deleteBoard.mutate({ id })}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                paperCount={board.paperCount}
                onDelete={() => deleteBoard.mutate({ id: board.id })}
              />
            ))}

            {currentPage < totalPages ? (
              <button
                type="button"
                onClick={() => updatePage(currentPage + 1)}
                className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed bg-card p-5 text-center transition-colors hover:border-ps-coral hover:bg-ps-coral/5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-ps-coral text-white">
                  <ChevronRight className="size-5" />
                </span>
                <span className="mt-3 font-semibold text-foreground">Next 20 boards</span>
                <span className="mt-1 text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {from}-{to} of {totalBoards} boards
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => updatePage(currentPage - 1)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <span className="min-w-24 text-center text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => updatePage(currentPage + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
