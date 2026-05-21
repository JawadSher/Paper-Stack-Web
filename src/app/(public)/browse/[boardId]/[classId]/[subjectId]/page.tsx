"use client";

import { useParams } from "next/navigation";
import { PaperListClient } from "@/components/public/browse/PaperListClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetBoardById } from "@/hooks/public/queries/useGetBoardById";
import { useGetPapersBySubject } from "@/hooks/public/queries/useGetPapersBySubject";
import { useGetSubjectsByBoardClass } from "@/hooks/public/queries/useGetSubjectsByBoardClass";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export default function PaperListPage() {
  const params = useParams<{ boardId: string; classId: string; subjectId: string }>();
  const boardId = params.boardId;
  const subjectId = params.subjectId;
  const classLevel = Number(params.classId) as ClassLevel;
  const { data: boardData } = useGetBoardById(boardId);
  const { data: subjects } = useGetSubjectsByBoardClass(boardId, classLevel);
  const { data: papers, isLoading } = useGetPapersBySubject(
    boardId,
    subjectId,
    classLevel,
  );

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
        classes: [9, 10, 11, 12],
        color: boardData.color,
      }
    : undefined;
  const subjectData = subjects?.find((subject) => subject.id === subjectId);
  const subject: Subject | undefined = subjectData
    ? { id: subjectData.id, name: subjectData.name, classLevel }
    : undefined;
  const paperList =
    papers?.map<Paper>((paper) => ({
      id: paper.id,
      title: paper.title,
      boardId: paper.boardId,
      subjectId: paper.subjectId,
      classLevel: paper.classLevel as ClassLevel,
      year: paper.year,
      session: paper.session,
      pdfUrl: paper.pdfUrl ?? "#",
      fileSizeBytes: paper.fileSizeBytes ? Number(paper.fileSizeBytes) : undefined,
      createdAt: paper.createdAt.toISOString(),
      updatedAt: paper.updatedAt.toISOString(),
    })) ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${subject?.name ?? "Subject"} papers - ${board?.shortName ?? "Board"} Class ${classLevel}`}
        subtitle="Filter by year or session and preview papers instantly."
        breadcrumbs={[
          { label: "Browse", href: "/browse" },
          { label: board?.shortName ?? "Board", href: `/browse/${boardId}` },
          { label: `Class ${classLevel}`, href: `/browse/${boardId}/${classLevel}` },
          { label: subject?.name ?? "Subject", href: `/browse/${boardId}/${classLevel}/${subjectId}` },
        ]}
      />
      <div className="mt-8">
        {isLoading || !board || !subject ? (
          <SkeletonCard />
        ) : (
          <PaperListClient
            board={board}
            subject={subject}
            classLevel={classLevel}
            papers={paperList}
          />
        )}
      </div>
    </section>
  );
}
