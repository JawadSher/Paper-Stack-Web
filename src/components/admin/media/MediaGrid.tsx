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
  onDelete: (file: MediaFile) => void;
};

export function MediaGrid({ files, selected, onToggle, onOpen, onDelete }: MediaGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
      {files.map((file) => (
        <article key={file.id} className="group relative min-h-44 rounded-lg border bg-card p-3 transition-all hover:border-ps-coral/45 hover:shadow-sm">
          <input type="checkbox" checked={selected.includes(file.id)} onChange={() => onToggle(file.id)} className="absolute left-3 top-3 z-10 size-4 accent-ps-coral" aria-label={`Select ${file.name}`} />
          <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <Button type="button" size="icon-sm" variant="secondary" aria-label={`View ${file.name}`} onClick={() => onOpen(file)}><Eye className="size-4" /></Button>
            <Button type="button" size="icon-sm" variant="destructive" aria-label={`Delete ${file.name}`} onClick={() => onDelete(file)}><Trash2 className="size-4" /></Button>
          </div>
          <button type="button" className="grid h-full w-full justify-items-center gap-3 pt-8 text-center" onClick={() => onOpen(file)}>
            <div className="grid size-16 place-items-center rounded-xl bg-secondary text-ps-coral">
              {file.type === "pdf" ? <FileText className="size-8" /> : <ImageIcon className="size-8" />}
            </div>
            <div className="min-w-0 max-w-full">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)}</p>
            </div>
          </button>
        </article>
      ))}
    </div>
  );
}
