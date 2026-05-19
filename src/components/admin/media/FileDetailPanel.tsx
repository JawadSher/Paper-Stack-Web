"use client";

import Image from "next/image";
import { Copy, Download, Replace, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PaperCard } from "@/components/shared/PaperCard";
import { PdfPreviewPane } from "@/components/shared/PdfPreviewPane";
import { adminPapers } from "@/constants/admin-papers";
import { mediaMeta, type MediaFile } from "@/constants/admin-media";

export type FileDetailPanelProps = {
  file: MediaFile | null;
  onOpenChange: (open: boolean) => void;
};

export function FileDetailPanel({ file, onOpenChange }: FileDetailPanelProps) {
  const meta = file ? mediaMeta(file) : undefined;
  const paper = file?.paperId ? adminPapers.find((item) => item.id === file.paperId) : undefined;

  return (
    <Sheet open={Boolean(file)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        {file ? (
          <>
            <SheetHeader>
              <SheetTitle>{file.name}</SheetTitle>
              <SheetDescription>{meta?.size} - Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-4">
              {file.dimensions ? <p className="text-sm text-muted-foreground">Dimensions: {file.dimensions}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(file.url); toast.success("Public URL copied"); }}><Copy className="size-4" />Copy public URL</Button>
                <Button type="button" size="sm" variant="outline"><Download className="size-4" />Download</Button>
                <Button type="button" size="sm" variant="outline"><Replace className="size-4" />Replace file</Button>
                <Button type="button" size="sm" variant="destructive"><Trash2 className="size-4" />Delete</Button>
              </div>
              {file.type === "pdf" ? (
                <PdfPreviewPane pdfUrl={file.url} title={file.name} />
              ) : (
                <Image
                  src={file.url}
                  alt={file.name}
                  width={728}
                  height={410}
                  className="rounded-lg border"
                />
              )}
              {paper && meta?.board && meta.subject ? (
                <div>
                  <h3 className="mb-3 font-semibold">Linked paper</h3>
                  <PaperCard paper={paper} board={meta.board} subject={meta.subject} variant="compact" />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
