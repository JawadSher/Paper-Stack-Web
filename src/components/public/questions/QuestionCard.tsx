"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FrequencyBar } from "@/components/shared/FrequencyBar";
import { YearDots } from "@/components/shared/YearDots";
import type { CommonQuestion } from "@/constants/questions";

export type QuestionCardProps = {
  question: CommonQuestion;
};

export function QuestionCard({ question }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{question.chapter}</Badge>
        {question.marks ? <Badge variant="outline">{question.marks} marks</Badge> : null}
      </div>
      <p className="mt-3 text-sm leading-6">
        {expanded ? question.prompt : question.prompt.slice(0, 120)}
        {!expanded && question.prompt.length > 120 ? "..." : ""}
      </p>
      {question.prompt.length > 120 ? (
        <Button type="button" size="sm" variant="link" className="mt-2 px-0" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show less" : "Read more"}
        </Button>
      ) : null}
      <div className="mt-5 space-y-4">
        <FrequencyBar frequency={question.yearsAppeared.length} totalYears={5} />
        <div className="flex items-center justify-between gap-3">
          <YearDots yearsAppeared={question.yearsAppeared} />
          <Link href={`/paper/${question.paperId}`} className="inline-flex items-center gap-1 text-sm font-medium text-ps-coral">
            View in paper
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
