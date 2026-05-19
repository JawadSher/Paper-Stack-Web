"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Grid2X2, Plus, Table2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BoardCard } from "@/components/admin/boards/BoardCard";
import { BoardsTable } from "@/components/admin/boards/BoardsTable";
import { adminBoards } from "@/constants/admin-boards";
import { mockPapers } from "@/constants/papers";
import { cn } from "@/lib/utils";

const provinceTabs = ["All", "Federal", "Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB"] as const;

export function BoardsManager() {
  const [province, setProvince] = useState<(typeof provinceTabs)[number]>("All");
  const [view, setView] = useState<"table" | "grid">("table");

  const filteredBoards = useMemo(
    () =>
      adminBoards.filter((board) => {
        if (province === "All") return true;
        if (province === "GB") return board.province === "Gilgit-Baltistan";
        return board.province === province;
      }),
    [province],
  );

  const getPaperCount = (boardId: string) => mockPapers.filter((paper) => paper.boardId === boardId).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {provinceTabs.map((tab) => (
            <Button key={tab} type="button" size="sm" variant={province === tab ? "default" : "outline"} onClick={() => setProvince(tab)}>
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
      {view === "table" ? (
        <BoardsTable boards={filteredBoards} getPaperCount={getPaperCount} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} paperCount={getPaperCount(board.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
