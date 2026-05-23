import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CommonQuestionsClient } from "@/components/public/questions/CommonQuestionsClient";
import { BoardBadge } from "@/components/shared/BoardBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { getBoardById } from "@/src/actions/public/boards";
import { getCommonQuestions } from "@/src/actions/public/questions";
import { getSubjectById } from "@/src/actions/public/subjects";
import type { CommonQuestion } from "@/constants/questions";
import type { Board, ClassLevel, Subject } from "@/types";

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
  const classLevel = classId ? (Number(classId) as ClassLevel) : undefined;

  const [subjectResult, boardResult, questionsResult] = await Promise.all([
    getSubjectById(subjectId),
    boardId ? getBoardById(boardId) : Promise.resolve(null),
    getCommonQuestions({
      subjectId,
      boardId,
      classLevel,
    }),
  ]);

  if (!subjectResult.success || !subjectResult.data) notFound();

  const subject: Subject = {
    id: subjectResult.data.id,
    name: subjectResult.data.name,
    classLevel: classLevel ?? 9,
  };

  const boardData = boardResult && "success" in boardResult && boardResult.success ? boardResult.data : null;
  const board: Board | undefined = boardData
    ? {
        id: boardData.id,
        name: boardData.name,
        shortName: boardData.shortName,
        description: boardData.description ?? "",
        province:
          boardData.province === "Gilgit_Baltistan"
            ? "Gilgit-Baltistan"
            : boardData.province,
        classes: boardData.classes as ClassLevel[],
        color: boardData.color,
      }
    : undefined;

  const questions: CommonQuestion[] = questionsResult.success
    ? questionsResult.data.map((question) => ({
        id: question.id,
        paperId: question.questionPaperLinks[0]?.paperId ?? "",
        subjectId: question.subjectId,
        classLevel: question.classLevel as ClassLevel,
        prompt: question.questionText,
        marks: question.marks ?? undefined,
        section: question.section ?? undefined,
        pageNumber: question.questionPaperLinks[0]?.pageNumber ?? undefined,
        chapter: question.chapterName,
        yearsAppeared: question.yearsAppeared,
      }))
    : [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${subject.name} common questions`}
        subtitle="Repeated questions grouped by chapter and frequency."
        breadcrumbs={[{ label: "Browse", href: "/browse" }, { label: "Common Questions", href: `/common-questions/${subject.id}` }]}
        actions={
          <div className="flex items-center gap-2">
            {board ? <BoardBadge board={board} /> : null}
            <Badge variant="secondary">Class {classLevel ?? subject.classLevel}</Badge>
          </div>
        }
      />
      <div className="mt-8">
        <CommonQuestionsClient subject={subject} board={board} questions={questions} />
      </div>
    </section>
  );
}
