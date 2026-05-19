"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PdfPreviewPane } from "@/components/shared/PdfPreviewPane";
import { PaperListRow } from "@/components/public/browse/PaperListRow";
import { PdfPlaceholder } from "@/components/public/viewer/PdfPlaceholder";
import { cn } from "@/lib/utils";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export type PaperListClientProps = {
  board: Board;
  subject: Subject;
  classLevel: ClassLevel;
  papers: Paper[];
};

const years = ["all", "2024", "2023", "2022", "2021", "2020", "2019"] as const;
const sessions = ["all", "annual", "supplementary"] as const;

export function PaperListClient({
  board,
  subject,
  classLevel,
  papers,
}: PaperListClientProps) {
  const [year, setYear] = useState<(typeof years)[number]>("all");
  const [session, setSession] = useState<(typeof sessions)[number]>("all");
  const [selectedPaperId, setSelectedPaperId] = useState<string>();

  const filteredPapers = useMemo(
    () =>
      papers.filter((paper) => {
        const matchesYear = year === "all" || paper.year === Number(year);
        const matchesSession = session === "all" || paper.session === session;
        return matchesYear && matchesSession;
      }),
    [papers, session, year],
  );

  const selectedPaper =
    filteredPapers.find((paper) => paper.id === selectedPaperId) ??
    filteredPapers[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
      <aside className="space-y-4 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium">Year</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {years.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={year === item ? "default" : "outline"}
                onClick={() => setYear(item)}
              >
                {item === "all" ? "All" : item}
              </Button>
            ))}
          </div>
          <p className="mt-5 text-sm font-medium">Session</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sessions.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={session === item ? "default" : "outline"}
                className="capitalize"
                onClick={() => setSession(item)}
              >
                {item === "all" ? "All" : item === "supplementary" ? "Supp" : item}
              </Button>
            ))}
          </div>
        </div>

        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {filteredPapers.map((paper) => (
            <div key={paper.id}>
              <div className="hidden lg:block">
                <PaperListRow
                  paper={paper}
                  selected={paper.id === selectedPaper?.id}
                  onSelect={() => setSelectedPaperId(paper.id)}
                />
              </div>
              <Link
                href={`/paper/${paper.id}`}
                className={cn("block lg:hidden")}
              >
                <PaperListRow paper={paper} onSelect={() => undefined} />
              </Link>
            </div>
          ))}
        </div>

        <Link
          href={`/common-questions/${subject.id}?boardId=${board.id}&classId=${classLevel}`}
          className="block rounded-lg border border-ps-coral/25 bg-ps-coral/10 p-4"
        >
          <Badge className="bg-ps-coral text-white">Common questions</Badge>
          <p className="mt-3 font-medium">Common questions for this subject</p>
          <p className="mt-1 text-sm text-muted-foreground">
            See repeated questions across recent papers.
          </p>
        </Link>
      </aside>

      <section className="hidden lg:block">
        {selectedPaper ? (
          <PdfPreviewPane
            pdfUrl={selectedPaper.pdfUrl}
            title={`${subject.name} ${selectedPaper.year} - ${board.shortName}`}
          />
        ) : (
          <PdfPlaceholder />
        )}
      </section>
    </div>
  );
}
