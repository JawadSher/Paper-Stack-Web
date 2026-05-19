"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminBoard } from "./types";

export type BoardCardProps = {
  board: AdminBoard;
  paperCount: number;
};

export function BoardCard({ board, paperCount }: BoardCardProps) {
  return (
    <article
      className="rounded-lg border bg-card p-5"
      style={{ borderLeftColor: board.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{board.shortName}</p>
          <h3 className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {board.name}
          </h3>
        </div>
        <Badge className="border-transparent text-white" style={{ backgroundColor: board.color }}>
          {board.province}
        </Badge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary">Classes {board.classes.join(", ")}</Badge>
        <Badge variant="outline">{paperCount} papers</Badge>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          size="sm"
          variant={board.status === "active" ? "default" : "outline"}
          onClick={() => toast.success(`${board.shortName} status toggle simulated`)}
        >
          {board.status === "active" ? "Active" : "Inactive"}
        </Button>
        <div className="flex gap-1">
          <Button type="button" size="icon-sm" variant="ghost" aria-label={`Edit ${board.shortName}`}>
            <Link href={`/boards/${board.id}/edit`}>
              <Edit className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Delete ${board.shortName}`}
            onClick={() => toast.success("Board delete queued")}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
