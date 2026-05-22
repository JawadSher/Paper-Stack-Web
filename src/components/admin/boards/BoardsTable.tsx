"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBoard } from "./types";

export type BoardsTableProps = {
  boards: Array<AdminBoard & { paperCount?: number }>;
  total?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onDelete: (id: string) => void;
};

export function BoardsTable({
  boards,
  total = boards.length,
  totalPages = 1,
  page = 1,
  pageSize = 20,
  onPageChange,
  onDelete,
}: BoardsTableProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const from = boards.length ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(total, (page - 1) * pageSize + boards.length);

  console.log(boards);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table className="min-w-[900px] table-fixed">
        <TableHeader className="bg-muted/70">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[30%] px-4 font-semibold">Board name</TableHead>
            <TableHead className="w-[12%] font-semibold">Short name</TableHead>
            <TableHead className="w-[14%] font-semibold">Province</TableHead>
            <TableHead className="w-[12%] font-semibold">Classes</TableHead>
            <TableHead className="w-[12%] font-semibold">Paper count</TableHead>
            <TableHead className="w-[10%] font-semibold">Status</TableHead>
            <TableHead className="w-[10%] pr-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boards.length ? (
            boards.map((board) => (
              <TableRow key={board.id}>
                <TableCell className="px-4 font-medium whitespace-normal">
                  <span className="line-clamp-2 break-words">{board.name}</span>
                </TableCell>
                <TableCell className="truncate">{board.shortName}</TableCell>
                <TableCell>
                  <Badge className="max-w-full border-transparent text-white" style={{ backgroundColor: board.color }}>
                    <span className="truncate">{board.province}</span>
                  </Badge>
                </TableCell>
                <TableCell>{board.classes.join(", ")}</TableCell>
                <TableCell>{board.paperCount ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={board.status === "active" ? "default" : "secondary"}>
                    {board.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button type="button" size="icon-sm" variant="ghost">
                      <Link href={`/boards/${board.id}/edit`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onDelete(board.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No boards found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {from}-{to} of {total} boards
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="min-w-24 text-center text-sm text-muted-foreground">
            Page {page} of {safeTotalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= safeTotalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
