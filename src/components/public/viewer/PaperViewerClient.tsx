"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaperCard } from "@/components/shared/PaperCard";
import { PdfPreviewPane } from "@/components/shared/PdfPreviewPane";
import { cn } from "@/lib/utils";
import type { Board, Paper, Subject } from "@/types";

export type PaperViewerClientProps = {
  paper: Paper;
  board: Board;
  subject: Subject;
  relatedPapers: Paper[];
};

export function PaperViewerClient({
  paper,
  board,
  subject,
  relatedPapers,
}: PaperViewerClientProps) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur md:top-16">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/browse/${board.id}/${paper.classLevel}/${subject.id}`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold">{paper.title}</h1>
            <p className="text-sm text-muted-foreground">{board.shortName} - Class {paper.classLevel}</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button type="button" size="icon-sm" variant="ghost" aria-pressed={bookmarked} onClick={() => setBookmarked((value) => !value)}>
              <Bookmark className={cn("size-4", bookmarked && "fill-ps-coral text-ps-coral")} />
            </Button>
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => navigator.share?.({ title: paper.title, url: window.location.href })}>
              <Share2 className="size-4" />
            </Button>
            <Button type="button" size="sm">
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <PdfPreviewPane pdfUrl={paper.pdfUrl} title={paper.title} />
        <Link
          href={`/common-questions/${subject.id}?boardId=${board.id}&classId=${paper.classLevel}`}
          className="block rounded-lg border border-ps-teal/30 bg-ps-teal/10 p-5"
        >
          <p className="font-semibold">Common questions for {subject.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            See repeated questions and frequency by year.
          </p>
        </Link>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related papers</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPapers.map((related) => (
              <PaperCard key={related.id} paper={related} board={board} subject={subject} variant="compact" />
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-background p-2 sm:hidden">
        <Button type="button" size="sm" variant="ghost" onClick={() => setBookmarked((value) => !value)}>
          <Bookmark className="size-4" />
          Save
        </Button>
        <Button type="button" size="sm" variant="ghost">
          <Share2 className="size-4" />
          Share
        </Button>
        <Button type="button" size="sm">
          <Download className="size-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
