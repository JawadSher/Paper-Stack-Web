import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClassSelector } from "@/components/public/browse/ClassSelector";
import { SubjectCard } from "@/components/public/browse/SubjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { getBoardDetailById } from "@/src/actions/public/boards";
import type { Board, Subject } from "@/types";

export type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  const { boardId } = await params;
  if (!boardId) {
    notFound();
  }

  const result = await getBoardDetailById(boardId);
  if (!result.success || !result.data) {
    notFound();
  }

  const board: Board = {
    id: result.data.board.id,
    name: result.data.board.name,
    shortName: result.data.board.shortName,
    description: result.data.board.description ?? "",
    province:
      result.data.board.province === "Gilgit_Baltistan"
        ? "Gilgit-Baltistan"
        : result.data.board.province,
    classes: [9, 10, 11, 12],
    color: result.data.board.color,
  };
  const previewSubjects = result.data.previewSubjects.map<
    Subject & { paperCount: number }
  >((subject) => ({
    id: subject.id,
    name: subject.name,
    classLevel: subject.classLevel as Subject["classLevel"],
    paperCount: subject.paperCount,
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={board.name}
        subtitle={board.description}
        breadcrumbs={[
          { label: "Browse", href: "/browse" },
          { label: board.shortName, href: `/browse/${board.id}` },
        ]}
        actions={
          <Badge
            className="border-transparent text-white"
            style={{ backgroundColor: board.color }}
          >
            {board.province}
          </Badge>
        }
      />
      <div className="mt-8 space-y-8">
        <ClassSelector boardId={board.id} />
        <div>
          <h2 className="text-xl font-semibold">
            Class {board.classes[0]} subjects
          </h2>
          {previewSubjects.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {previewSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  boardId={board.id}
                  subject={subject}
                  paperCount={subject.paperCount}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed bg-card px-6 py-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
                <BookOpen className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                No subjects available yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Subjects and past papers for {board.shortName} are being
                prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
