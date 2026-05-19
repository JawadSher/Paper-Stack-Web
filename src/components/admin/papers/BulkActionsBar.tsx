"use client";

import { Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BulkActionsBarProps = {
  selectedCount: number;
  onDeleteSelected: () => void;
  onExportList: () => void;
  onDismiss: () => void;
};

export function BulkActionsBar({
  selectedCount,
  onDeleteSelected,
  onExportList,
  onDismiss,
}: BulkActionsBarProps) {
  if (selectedCount < 1) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{selectedCount} papers selected</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="destructive" onClick={onDeleteSelected}>
          <Trash2 className="size-4" />
          Delete selected
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onExportList}>
          <Download className="size-4" />
          Export list
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" onClick={onDismiss}>
          <X className="size-4" />
          <span className="sr-only">Dismiss selection</span>
        </Button>
      </div>
    </div>
  );
}
