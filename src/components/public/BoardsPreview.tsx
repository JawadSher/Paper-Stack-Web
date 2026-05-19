import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { boards } from "@/constants/boards";

export type BoardsPreviewProps = Record<string, never>;

export function BoardsPreview({}: BoardsPreviewProps) {
  return (
    <section className="bg-secondary/45 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">
              All Pakistan boards covered
            </h2>
            <p className="mt-3 text-muted-foreground">
              Browse the boards students actually use across Pakistan.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1 text-sm font-medium text-ps-coral"
          >
            Browse all boards
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
          {boards.map((board) => (
            <article
              key={board.id}
              className="min-w-[230px] snap-start rounded-lg border bg-card p-5"
              style={{ borderTopColor: board.color, borderTopWidth: 4 }}
            >
              <p className="text-2xl font-semibold">{board.shortName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className="border-transparent text-white"
                  style={{ backgroundColor: board.color }}
                >
                  {board.province}
                </Badge>
                <Badge variant="secondary">9-12</Badge>
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                {board.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
