import { notFound } from "next/navigation";
import { PaperListClient } from "@/components/public/browse/PaperListClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";
import type { ClassLevel } from "@/types";

export type PaperListPageProps = {
  params: Promise<{ boardId: string; classId: string; subjectId: string }>;
};

export default async function PaperListPage({ params }: PaperListPageProps) {
  const { boardId, classId, subjectId } = await params;
  const board = boards.find((item) => item.id === boardId);
  const classLevel = Number(classId) as ClassLevel;
  const subject = subjects.find((item) => item.id === subjectId);
  if (!board || !subject || ![9, 10, 11, 12].includes(classLevel)) notFound();

  const papers = mockPapers.filter(
    (paper) =>
      paper.boardId === board.id &&
      paper.classLevel === classLevel &&
      paper.subjectId === subject.id,
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${subject.name} papers - ${board.shortName} Class ${classLevel}`}
        subtitle="Filter by year or session and preview papers instantly."
        breadcrumbs={[
          { label: "Browse", href: "/browse" },
          { label: board.shortName, href: `/browse/${board.id}` },
          { label: `Class ${classLevel}`, href: `/browse/${board.id}/${classLevel}` },
          { label: subject.name, href: `/browse/${board.id}/${classLevel}/${subject.id}` },
        ]}
      />
      <div className="mt-8">
        <PaperListClient board={board} subject={subject} classLevel={classLevel} papers={papers} />
      </div>
    </section>
  );
}
