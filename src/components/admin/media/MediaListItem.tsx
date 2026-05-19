"use client";

import { Copy, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/constants/admin-papers";
import { mediaMeta, type MediaFile } from "@/constants/admin-media";

export type MediaListItemProps = {
  file: MediaFile;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

export function MediaListItem({ file, selected, onToggle, onOpen }: MediaListItemProps) {
  const meta = mediaMeta(file);
  return (
    <TableRow>
      <TableCell><input type="checkbox" checked={selected} onChange={onToggle} className="size-4 accent-ps-coral" /></TableCell>
      <TableCell className="font-medium">{file.name}</TableCell>
      <TableCell>{formatFileSize(file.sizeBytes)}</TableCell>
      <TableCell>{meta.board?.shortName ?? "-"}</TableCell>
      <TableCell>{meta.subject?.name ?? "-"}</TableCell>
      <TableCell>{file.year ?? "-"}</TableCell>
      <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Button type="button" size="icon-sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(file.url); toast.success("URL copied"); }}><Copy className="size-4" /></Button>
          <Button type="button" size="icon-sm" variant="ghost" onClick={onOpen}><Eye className="size-4" /></Button>
          <Button type="button" size="icon-sm" variant="ghost"><Trash2 className="size-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
