import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { getBoardDetailById } from "@/src/actions/public/boards";
import type { Board, ClassLevel } from "@/types";

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
    classes: result.data.board.classes as ClassLevel[],
    color: result.data.board.color,
  };
  const classSummaries = result.data.classSummaries.map((summary) => ({
    ...summary,
    classLevel: summary.classLevel as ClassLevel,
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
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Choose a class</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with an available class for {board.shortName}; subjects
                and papers appear on the next step.
              </p>
            </div>
          </div>

          {classSummaries.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {classSummaries.map((summary) => (
                <Link
                  key={summary.classLevel}
                  href={`/browse/${board.id}/${summary.classLevel}`}
                  className="group rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-(--board-color) hover:bg-(--board-color-wash)"
                  style={
                    {
                      "--board-color": board.color,
                      "--board-color-soft": `color-mix(in srgb, ${board.color} 12%, transparent)`,
                      "--board-color-wash": `color-mix(in srgb, ${board.color} 6%, var(--card))`,

                      borderTopColor: board.color,
                      borderTopWidth: 4,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid size-11 place-items-center rounded-lg bg-(--board-color-soft) text-(--board-color)">
                      <GraduationCap className="size-6" />
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-(--board-color)" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">
                    Class {summary.classLevel}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      className="border-transparent text-white"
                      style={{ backgroundColor: board.color }}
                    >
                      {summary.subjectCount} subjects
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-(--board-color-soft) text-(--board-color)"
                      style={{ borderColor: board.color }}
                    >
                      {summary.paperCount} papers
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="mt-4 rounded-lg border border-dashed bg-(--board-color-wash) px-6 py-10 text-center"
              style={
                {
                  "--board-color": board.color,
                  "--board-color-soft": `color-mix(in srgb, ${board.color} 12%, transparent)`,
                  "--board-color-wash": `color-mix(in srgb, ${board.color} 6%, var(--card))`,
                  borderColor: board.color,
                } as CSSProperties
              }
            >
              <div className="mx-auto grid size-12 place-items-center rounded-lg bg-(--board-color-soft) text-(--board-color)">
                <BookOpen className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Classes are coming soon
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                We are preparing classes, subjects, and past papers for{" "}
                {board.shortName}. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
