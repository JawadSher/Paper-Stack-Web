"use client";

import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { QuestionCard } from "@/components/public/questions/QuestionCard";
import type { CommonQuestion } from "@/constants/questions";
import type { Board, Subject } from "@/types";

export type CommonQuestionsClientProps = {
  subject: Subject;
  board?: Board;
  questions: CommonQuestion[];
};

const frequencyFilters = [
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "All 5 years", value: 5 },
];

export function CommonQuestionsClient({
  subject,
  board,
  questions,
}: CommonQuestionsClientProps) {
  const [minimumFrequency, setMinimumFrequency] = useState(2);
  const [openChapters, setOpenChapters] = useState<string[]>([]);

  const filteredQuestions = questions.filter(
    (question) => question.yearsAppeared.length >= minimumFrequency,
  );

  const grouped = useMemo(
    () =>
      filteredQuestions.reduce<Record<string, CommonQuestion[]>>((groups, question) => {
        groups[question.chapter] = [...(groups[question.chapter] ?? []), question];
        return groups;
      }, {}),
    [filteredQuestions],
  );

  const chapters = Object.keys(grouped);
  const repeatCount = questions.filter((question) => question.yearsAppeared.length >= 3).length;
  const mostRepeatedChapter = questions
    .slice()
    .sort((a, b) => b.yearsAppeared.length - a.yearsAppeared.length)[0]?.chapter;

  async function shareSummary() {
    const summary = `${subject.name}: ${questions.length} common questions${board ? ` for ${board.shortName}` : ""}.`;
    await navigator.clipboard.writeText(summary);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total questions</p>
          <p className="mt-2 text-3xl font-semibold">{questions.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Repeat count</p>
          <p className="mt-2 text-3xl font-semibold">{repeatCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Most repeated chapter</p>
          <p className="mt-2 text-lg font-semibold">{mostRepeatedChapter ?? "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {frequencyFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={minimumFrequency === filter.value ? "default" : "outline"}
              onClick={() => setMinimumFrequency(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={shareSummary}>
          <Share2 className="size-4" />
          Share
        </Button>
      </div>

      {filteredQuestions.length ? (
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const isOpen = openChapters.includes(chapter) || !openChapters.length;
            return (
              <section key={chapter} className="rounded-lg border bg-card">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                  onClick={() =>
                    setOpenChapters((chapters) =>
                      chapters.includes(chapter)
                        ? chapters.filter((item) => item !== chapter)
                        : [...chapters, chapter],
                    )
                  }
                >
                  <span className="font-semibold">{chapter}</span>
                  <Badge variant="secondary">{grouped[chapter].length}</Badge>
                </button>
                {isOpen ? (
                  <div className="grid gap-3 border-t p-4">
                    {grouped[chapter].map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyState
          variant="card"
          icon={Share2}
          title="No common questions yet"
          subtitle="Try a lower frequency filter or another subject."
        />
      )}
    </div>
  );
}
