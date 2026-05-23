"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export type PdfPreviewPaneProps = {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
};

export function PdfPreviewPane({
  pdfUrl,
  title,
  onClose,
}: PdfPreviewPaneProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState<number>();
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [pageWidth, setPageWidth] = useState(400);
  const previewRef = useRef<HTMLDivElement>(null);

  const file = useMemo(() => ({ url: pdfUrl }), [pdfUrl]);
  const hasPdf = Boolean(pdfUrl && pdfUrl !== "#");

  async function downloadPdf() {
    if (!hasPdf) return;

    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Could not download PDF");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.trim().replace(/[^\w\s.-]/g, "").replace(/\s+/g, "-") || "paper"}.pdf`;
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const updatePageWidth = () => {
      setPageWidth(Math.max(240, Math.min(760, element.clientWidth - 32)));
    };
    updatePageWidth();

    const observer = new ResizeObserver(updatePageWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex h-full min-h-[640px] flex-col overflow-hidden rounded-lg border bg-card">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Page {pageNumber}
            {pageCount ? ` of ${pageCount}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pageNumber <= 1}
            className="disabled:border-border/60 disabled:bg-muted/30 disabled:text-muted-foreground"
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
          >
            Prev
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pageCount ? pageNumber >= pageCount : true}
            className="disabled:border-border/60 disabled:bg-muted/30 disabled:text-muted-foreground"
            onClick={() =>
              setPageNumber((page) => (pageCount ? Math.min(pageCount, page + 1) : page))
            }
          >
            Next
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={!hasPdf}
            aria-label="Download PDF"
            onClick={downloadPdf}
          >
            <Download className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={!hasPdf}
            aria-label="Open PDF in new tab"
            onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="size-4" />
          </Button>
          {onClose ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </header>

      <div ref={previewRef} className="grid flex-1 place-items-start overflow-auto bg-muted/25 p-4">
        {loadError ? (
          <div className="mx-auto mt-16 grid max-w-sm justify-items-center gap-3 text-center">
            <p className="font-medium">Could not load PDF</p>
            <p className="text-sm text-muted-foreground">
              Check the file URL or try loading the preview again.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setLoadError(false);
                setRetryKey((key) => key + 1);
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <Document
            key={retryKey}
            file={file}
            loading={<Skeleton className="h-[560px] w-[400px]" />}
            error={null}
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages);
              setPageNumber(1);
              setLoadError(false);
            }}
            onLoadError={() => setLoadError(true)}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={<Skeleton className="h-[560px] w-[400px]" />}
            />
          </Document>
        )}
      </div>
    </section>
  );
}
