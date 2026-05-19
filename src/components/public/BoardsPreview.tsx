import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { boards } from "@/constants/boards";

export type BoardsPreviewProps = Record<string, never>;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export function BoardsPreview({}: BoardsPreviewProps) {
  const loopBoards = [...boards, ...boards];

  return (
    <section className="overflow-hidden bg-secondary/35 py-24">
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

        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max gap-4 pb-4 [animation:ps-scroll_120s_linear_infinite] hover:[animation-play-state:paused]">
            {loopBoards.map((board, index) => {
              const rgb = hexToRgb(board.color);

              return (
                <article
                  key={`${board.id}-${index}`}
                  className="min-w-[230px] rounded-lg border border-border/60 bg-card bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:16px_16px] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lg"
                  style={{
                    borderTopColor: board.color,
                    borderTopWidth: 3,
                    boxShadow: `0 -1px 12px rgba(${rgb}, 0.22)`,
                  }}
                >
                  <p className="text-2xl font-semibold">{board.shortName}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      className="border-transparent text-white shadow-sm"
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
