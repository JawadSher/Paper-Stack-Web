"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoardBadge } from "@/components/shared/BoardBadge";
import { PdfPreviewPane } from "@/components/shared/PdfPreviewPane";
import { SessionBadge } from "@/components/shared/SessionBadge";
import { SubjectIcon } from "@/components/shared/SubjectIcon";
import { BulkActionsBar } from "@/components/admin/papers/BulkActionsBar";
import { PaperStatusBadge } from "@/components/admin/papers/PaperStatusBadge";
import { boards } from "@/constants/boards";
import {
  formatFileSize,
  formatRelativeDate,
  type AdminPaper,
  type PaperStatus,
} from "@/constants/admin-papers";
import { subjects } from "@/constants/subjects";
import { cn } from "@/lib/utils";

export type PapersTableProps = {
  papers: AdminPaper[];
  totalPages?: number;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onStatusChange: (id: string, status: PaperStatus) => void;
  onDelete: (paper: AdminPaper) => void;
  onBulkDelete: (ids: string[]) => void;
};

function getBoard(paper: AdminPaper) {
  return paper.board ?? boards.find((board) => board.id === paper.boardId);
}

function getSubject(paper: AdminPaper) {
  return paper.subject ?? subjects.find((subject) => subject.id === paper.subjectId);
}

function getPaperAccentStyle(paper: AdminPaper): CSSProperties {
  const color = getBoard(paper)?.color ?? "var(--ps-coral)";

  return {
    "--paper-accent": color,
    "--paper-accent-soft": `color-mix(in srgb, ${color} 12%, transparent)`,
  } as CSSProperties;
}

function exportCsv(papers: AdminPaper[]) {
  const rows = [
    ["Subject", "Board", "Class", "Year", "Session", "Status", "File size"],
    ...papers.map((paper) => [
      getSubject(paper)?.name ?? "Unknown",
      getBoard(paper)?.shortName ?? "Unknown",
      `Class ${paper.classLevel}`,
      String(paper.year),
      paper.session ?? "",
      paper.status,
      formatFileSize(paper.fileSizeBytes),
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "paperstack-papers.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PapersTable({
  papers,
  totalPages = 1,
  totalCount = papers.length,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  onStatusChange,
  onDelete,
  onBulkDelete,
}: PapersTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedPaper, setSelectedPaper] = useState<AdminPaper | null>(null);

  const columns = useMemo<ColumnDef<AdminPaper>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="Select all papers"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="size-4 accent-ps-coral"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select ${row.original.title}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(event) => event.stopPropagation()}
            className="size-4 accent-ps-coral"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "subjectId",
        header: "Subject",
        cell: ({ row }) => {
          const subject = getSubject(row.original);

          return (
            <div className="flex items-center gap-2" style={getPaperAccentStyle(row.original)}>
              <div className="grid size-8 place-items-center rounded-lg bg-(--paper-accent-soft) text-(--paper-accent)">
                <SubjectIcon subjectName={subject?.name ?? row.original.title} size={17} />
              </div>
              <span className="font-medium">{subject?.name ?? "Unknown"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "boardId",
        header: "Board",
        cell: ({ row }) => {
          const board = getBoard(row.original);
          return board ? <BoardBadge board={board} size="sm" /> : "Unknown";
        },
      },
      {
        accessorKey: "classLevel",
        header: "Class",
        cell: ({ row }) => (
          <span
            className="rounded-4xl bg-(--paper-accent-soft) px-2 py-1 text-xs font-medium text-(--paper-accent)"
            style={getPaperAccentStyle(row.original)}
          >
            Class {row.original.classLevel}
          </span>
        ),
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "session",
        header: "Session",
        cell: ({ row }) =>
          row.original.session ? (
            <SessionBadge session={row.original.session} />
          ) : null,
      },
      {
        accessorKey: "fileSizeBytes",
        header: "File size",
        cell: ({ row }) => formatFileSize(row.original.fileSizeBytes),
      },
      {
        accessorKey: "createdAt",
        header: "Uploaded",
        cell: ({ row }) => formatRelativeDate(row.original.createdAt),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onStatusChange(
                row.original.id,
                row.original.status === "live" ? "draft" : "live",
              );
            }}
          >
            <PaperStatusBadge status={row.original.status} />
          </Button>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={`View ${row.original.title}`}
              onClick={() => window.open(row.original.pdfUrl, "_blank", "noopener,noreferrer")}
            >
              <Eye className="size-4" />
            </Button>
            <Button type="button" size="icon-sm" variant="ghost" aria-label={`Edit ${row.original.title}`}>
              <Link href={`/papers/${row.original.id}/edit`}>
                <Edit className="size-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button type="button" size="icon-sm" variant="ghost" aria-label={`Delete ${row.original.title}`}>
                    <Trash2 className="size-4" />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete paper?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {row.original.title} and its storage file.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDelete(row.original)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      },
    ],
    [onDelete, onStatusChange],
  );

  const table = useReactTable({
    data: papers,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const from = totalCount ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(totalCount, (page - 1) * pageSize + papers.length);

  return (
    <div className="space-y-3">
      <BulkActionsBar
        selectedCount={selectedRows.length}
        onDeleteSelected={() => {
          onBulkDelete(selectedRows.map((paper) => paper.id));
          setRowSelection({});
        }}
        onExportList={() => exportCsv(selectedRows)}
        onDismiss={() => setRowSelection({})}
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(header.id === "actions" && "text-right")}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => setSelectedPaper(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.id === "actions" && "text-right")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  No papers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {from}-{to} of {totalCount} papers
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page <= 1}
              className="disabled:border-border/60 disabled:bg-muted/30 disabled:text-muted-foreground"
              onClick={() => onPageChange?.(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              className="disabled:border-border/60 disabled:bg-muted/30 disabled:text-muted-foreground"
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={Boolean(selectedPaper)} onOpenChange={(open) => !open && setSelectedPaper(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          {selectedPaper ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPaper.title}</SheetTitle>
                <SheetDescription>
                  {getBoard(selectedPaper)?.shortName} - Class {selectedPaper.classLevel}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {getBoard(selectedPaper) ? (
                    <BoardBadge board={getBoard(selectedPaper)!} />
                  ) : null}
                  {selectedPaper.session ? (
                    <SessionBadge session={selectedPaper.session} />
                  ) : null}
                  <PaperStatusBadge status={selectedPaper.status} />
                </div>
                <PdfPreviewPane
                  pdfUrl={selectedPaper.pdfUrl}
                  title={selectedPaper.title}
                />
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
