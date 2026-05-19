"use client";

import { FileText, ImageIcon, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/constants/admin-papers";
import type { MediaFile } from "@/constants/admin-media";

export type MediaGridProps = {
  files: MediaFile[];
  selected: string[];
  onToggle: (id: string) => void;
  onOpen: (file: MediaFile) => void;
};

export function MediaGrid({ files, selected, onToggle, onOpen }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {files.map((file) => (
        <article key={file.id} className="group relative rounded-lg border bg-card p-3">
          <input type="checkbox" checked={selected.includes(file.id)} onChange={() => onToggle(file.id)} className="absolute left-2 top-2 z-10 size-4 accent-ps-coral" />
          <button type="button" className="grid w-full justify-items-center gap-3 pt-4 text-center" onClick={() => onOpen(file)}>
            <div className="grid size-16 place-items-center rounded-lg bg-secondary text-ps-coral">
              {file.type === "pdf" ? <FileText className="size-8" /> : <ImageIcon className="size-8" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)}</p>
            </div>
          </button>
          <div className="absolute inset-0 hidden items-center justify-center gap-2 rounded-lg bg-background/80 group-hover:flex">
            <Button type="button" size="icon-sm" onClick={() => onOpen(file)}><Eye className="size-4" /></Button>
            <Button type="button" size="icon-sm" variant="destructive"><Trash2 className="size-4" /></Button>
          </div>
        </article>
      ))}
    </div>
  );
}
