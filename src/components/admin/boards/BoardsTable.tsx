"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
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
  totalPages?: number;
  page?: number;
  onDelete: (id: string) => void;
};

export function BoardsTable({ boards, totalPages = 1, page = 1, onDelete }: BoardsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Board name</TableHead>
            <TableHead>Short name</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead>Paper count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boards.map((board) => (
            <TableRow key={board.id}>
              <TableCell className="max-w-sm font-medium">{board.name}</TableCell>
              <TableCell>{board.shortName}</TableCell>
              <TableCell>
                <Badge className="border-transparent text-white" style={{ backgroundColor: board.color }}>
                  {board.province}
                </Badge>
              </TableCell>
              <TableCell>{board.classes.join(", ")}</TableCell>
              <TableCell>{board.paperCount ?? 0}</TableCell>
              <TableCell>
                <Badge variant={board.status === "active" ? "default" : "secondary"}>
                  {board.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
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
          ))}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
