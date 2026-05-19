import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubjectIcon } from "@/components/shared/SubjectIcon";
import type { Subject } from "@/types";

export type SubjectCardProps = {
  boardId: string;
  subject: Subject;
  paperCount: number;
  isCore?: boolean;
};

export function SubjectCard({
  boardId,
  subject,
  paperCount,
  isCore = false,
}: SubjectCardProps) {
  return (
    <Link
      href={`/browse/${boardId}/${subject.classLevel}/${subject.id}`}
      className="group rounded-lg border bg-card p-5 transition-colors hover:border-ps-coral/50"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-11 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
          <SubjectIcon subjectName={subject.name} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{subject.name}</h2>
            {isCore ? <Badge variant="secondary">Core</Badge> : null}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {paperCount} papers available
          </p>
        </div>
        <Badge variant="outline">{paperCount}</Badge>
      </div>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ps-coral">
        Common questions
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}
