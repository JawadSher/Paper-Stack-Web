import { notFound } from "next/navigation";
import { SubjectCard } from "@/components/public/browse/SubjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";
import type { ClassLevel } from "@/types";

export type SubjectListPageProps = {
  params: Promise<{ boardId: string; classId: string }>;
};

const coreSubjects = new Set(["English", "Urdu", "Islamiat", "Pakistan Studies"]);

export default async function SubjectListPage({ params }: SubjectListPageProps) {
  const { boardId, classId } = await params;
  const board = boards.find((item) => item.id === boardId);
  const classLevel = Number(classId) as ClassLevel;
  if (!board || ![9, 10, 11, 12].includes(classLevel)) notFound();

  const classSubjects = subjects
    .filter((subject) => subject.classLevel === classLevel)
    .sort((a, b) => Number(coreSubjects.has(b.name)) - Number(coreSubjects.has(a.name)));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${board.name} - Class ${classLevel}`}
        subtitle="Choose a subject to view past papers"
        breadcrumbs={[
          { label: "Browse", href: "/browse" },
          { label: board.shortName, href: `/browse/${board.id}` },
          { label: `Class ${classLevel}`, href: `/browse/${board.id}/${classLevel}` },
        ]}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {classSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            boardId={board.id}
            subject={subject}
            isCore={coreSubjects.has(subject.name)}
            paperCount={mockPapers.filter((paper) => paper.boardId === board.id && paper.subjectId === subject.id).length}
          />
        ))}
      </div>
    </section>
  );
}
