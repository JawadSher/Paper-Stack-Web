import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CommonQuestionsClient } from "@/components/public/questions/CommonQuestionsClient";
import { BoardBadge } from "@/components/shared/BoardBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { boards } from "@/constants/boards";
import { mockQuestions } from "@/constants/questions";
import { subjects } from "@/constants/subjects";

export type CommonQuestionsPageProps = {
  params: Promise<{ subjectId: string }>;
  searchParams: Promise<{ boardId?: string; classId?: string }>;
};

export default async function CommonQuestionsPage({
  params,
  searchParams,
}: CommonQuestionsPageProps) {
  const { subjectId } = await params;
  const { boardId, classId } = await searchParams;
  const subject = subjects.find((item) => item.id === subjectId);
  const board = boards.find((item) => item.id === boardId) ?? boards[0];
  if (!subject) notFound();

  const questions = mockQuestions.filter((question) => question.subjectId === subject.id);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${subject.name} common questions`}
        subtitle="Repeated questions grouped by chapter and frequency."
        breadcrumbs={[{ label: "Browse", href: "/browse" }, { label: "Common Questions", href: `/common-questions/${subject.id}` }]}
        actions={
          <div className="flex items-center gap-2">
            <BoardBadge board={board} />
            <Badge variant="secondary">Class {classId ?? subject.classLevel}</Badge>
          </div>
        }
      />
      <div className="mt-8">
        <CommonQuestionsClient subject={subject} board={board} questions={questions} />
      </div>
    </section>
  );
}
