"use client";

import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { ClassSelector } from "@/components/public/browse/ClassSelector";
import { SubjectCard } from "@/components/public/browse/SubjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetBoardById } from "@/hooks/public/queries/useGetBoardById";
import { useGetSubjectsByBoardClass } from "@/hooks/public/queries/useGetSubjectsByBoardClass";
import type { Board, ClassLevel, Subject } from "@/types";

const coreSubjects = new Set(["English", "Urdu", "Islamiat", "Pakistan Studies"]);
type ClassSubject = Subject & { paperCount: number };

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
        classes: boardData.classes as ClassLevel[],
        color: boardData.color,
      }
    : undefined;

  const classSubjects =
    subjects
      ?.map<ClassSubject>((subject) => ({
        id: subject.id,
        name: subject.name,
        classLevel,
        paperCount: subject.paperCount,
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
      <div className="mt-8">
        <ClassSelector
          boardId={boardId}
          classes={board?.classes}
          selectedClass={classLevel}
        />
      </div>
      <div className="mt-8">
        {boardLoading || subjectsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : classSubjects.length ? (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Class {classLevel} subjects</h2>
              <p className="text-sm text-muted-foreground">
                Choose a subject to view available papers and common questions.
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {classSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  boardId={boardId}
                  subject={subject}
                  isCore={coreSubjects.has(subject.name)}
                  paperCount={subject.paperCount}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed bg-card px-6 py-10 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
              <BookOpen className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Subjects are coming soon</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Class {classLevel} subjects and past papers for {board?.shortName ?? "this board"} are currently being prepared.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
