"use client";

import { useParams } from "next/navigation";
import { SubjectCard } from "@/components/public/browse/SubjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetBoardById } from "@/hooks/public/queries/useGetBoardById";
import { useGetSubjectsByBoardClass } from "@/hooks/public/queries/useGetSubjectsByBoardClass";
import type { Board, ClassLevel, Subject } from "@/types";

const coreSubjects = new Set(["English", "Urdu", "Islamiat", "Pakistan Studies"]);

export default function SubjectListPage() {
  const params = useParams<{ boardId: string; classId: string }>();
  const boardId = params.boardId;
  const classLevel = Number(params.classId) as ClassLevel;
  const { data: boardData, isLoading: boardLoading } = useGetBoardById(boardId);
  const { data: subjects, isLoading: subjectsLoading } =
    useGetSubjectsByBoardClass(boardId, classLevel);

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

  const classSubjects =
    subjects
      ?.map<Subject>((subject) => ({
        id: subject.id,
        name: subject.name,
        classLevel,
      }))
      .sort(
        (a, b) =>
          Number(coreSubjects.has(b.name)) - Number(coreSubjects.has(a.name)),
      ) ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={`${board?.name ?? "Board"} - Class ${classLevel}`}
        subtitle="Choose a subject to view past papers"
        breadcrumbs={[
          { label: "Browse", href: "/browse" },
          { label: board?.shortName ?? "Board", href: `/browse/${boardId}` },
          { label: `Class ${classLevel}`, href: `/browse/${boardId}/${classLevel}` },
        ]}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {boardLoading || subjectsLoading ? (
          Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          classSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              boardId={boardId}
              subject={subject}
              isCore={coreSubjects.has(subject.name)}
              paperCount={0}
            />
          ))
        )}
      </div>
    </section>
  );
}
