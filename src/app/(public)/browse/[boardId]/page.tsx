import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ClassSelector } from "@/components/public/browse/ClassSelector";
import { SubjectCard } from "@/components/public/browse/SubjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";

export type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { boardId } = await params;
  const board = boards.find((item) => item.id === boardId);
  if (!board){
     notFound();
  }

  const previewSubjects = subjects.filter((subject) => subject.classLevel === 10).slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={board.name}
        subtitle={board.description}
        breadcrumbs={[{ label: "Browse", href: "/browse" }, { label: board.shortName, href: `/browse/${board.id}` }]}
        actions={
          <Badge className="border-transparent text-white" style={{ backgroundColor: board.color }}>
            {board.province}
          </Badge>
        }
      />
      <div className="mt-8 space-y-8">
        <ClassSelector boardId={board.id} />
        <div>
          <h2 className="text-xl font-semibold">Class 10 subjects</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {previewSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                boardId={board.id}
                subject={subject}
                paperCount={mockPapers.filter((paper) => paper.boardId === board.id && paper.subjectId === subject.id).length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
