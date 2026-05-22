"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Link from "next/link";
import { Bookmark, Download, Eye } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoardBadge } from "@/components/shared/BoardBadge";
import { SessionBadge } from "@/components/shared/SessionBadge";
import { SubjectIcon } from "@/components/shared/SubjectIcon";
import { YearBadge } from "@/components/shared/YearBadge";
import { cn } from "@/lib/utils";
import type { Board, Paper, Subject } from "@/types";

export type PaperCardProps = {
  paper: Paper;
  board: Board;
  subject?: Subject;
  variant?: "default" | "compact";
};

export function PaperCard({
  paper,
  board,
  subject,
  variant = "default",
}: PaperCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const subjectName = subject?.name ?? paper.title;
  const isCompact = variant === "compact";

  return (
    <Card
      size={isCompact ? "sm" : "default"}
      className="border border-transparent transition-all hover:-translate-y-0.5 hover:border-(--paper-accent) hover:shadow-[0_14px_36px_var(--paper-accent-shadow)]"
      style={
        {
          "--paper-accent": board.color,
          "--paper-accent-soft": `color-mix(in srgb, ${board.color} 12%, transparent)`,
          "--paper-accent-wash": `color-mix(in srgb, ${board.color} 7%, var(--card))`,
          "--paper-accent-shadow": `color-mix(in srgb, ${board.color} 18%, transparent)`,
        } as CSSProperties
      }
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--paper-accent-soft) text-(--paper-accent)">
            <SubjectIcon subjectName={subjectName} size={21} />
          </div>
          <CardTitle>{subjectName}</CardTitle>
        </div>
        <CardAction>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"}
            onClick={() => setBookmarked((value) => !value)}
          >
            <Bookmark
              className={cn(
                "size-4",
                bookmarked && "fill-(--paper-accent) text-(--paper-accent)",
              )}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BoardBadge board={board} size={isCompact ? "sm" : "md"} />
          <YearBadge year={paper.year} />
          <span className="rounded-4xl bg-(--paper-accent-soft) px-2 py-0.5 text-xs font-medium text-(--paper-accent)">
            Class {paper.classLevel}
          </span>
          {paper.session ? <SessionBadge session={paper.session} /> : null}
        </div>
        {!isCompact ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {paper.title}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/paper/${paper.id}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-(--paper-accent) text-white hover:bg-(--paper-accent)",
            )}
          >
            <Eye className="size-4" />
            View PDF
          </Link>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-(--paper-accent) bg-(--paper-accent-soft) text-(--paper-accent) hover:bg-(--paper-accent-wash)"
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
