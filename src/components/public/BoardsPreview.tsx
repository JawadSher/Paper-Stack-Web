import Link from "next/link";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type BoardsPreviewBoard = {
  id: string;
  name: string;
  shortName: string;
  description: string | null;
  province: string;
  classes: number[];
  color: string;
};

export type BoardsPreviewProps = {
  boards: BoardsPreviewBoard[];
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return "207, 102, 121";
  }

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function formatProvince(province: string) {
  return province === "Gilgit_Baltistan"
    ? "Gilgit-Baltistan"
    : province.replaceAll("_", " ");
}

function formatClasses(classes: number[]) {
  if (!classes.length) {
    return "Classes";
  }

  const sortedClasses = [...classes].sort((a, b) => a - b);
  return sortedClasses.length > 1
    ? `${sortedClasses[0]}-${sortedClasses[sortedClasses.length - 1]}`
    : `${sortedClasses[0]}`;
}

export function BoardsPreview({ boards }: BoardsPreviewProps) {
  if (!boards.length) {
    return null;
  }

  const loopBoards = [...boards, ...boards];

  return (
    <section className="relative overflow-hidden bg-[#1A1917] py-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_420px_at_12%_15%,rgba(207,102,121,0.18),transparent_62%),radial-gradient(ellipse_560px_360px_at_88%_86%,rgba(45,184,150,0.14),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#CF6679]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-5 gap-2 border border-[#CF6679]/30 bg-white/5 text-[#F5C1CB] shadow-[0_0_30px_rgba(207,102,121,0.18)] backdrop-blur">
              <Sparkles className="size-3.5" />
              Pakistan coverage
            </Badge>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              All Pakistan boards covered
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/62">
              Browse the boards students actually use across Pakistan.
            </p>
          </div>
          <Link
            href="/browse"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#CF6679]/50 hover:bg-[#CF6679] hover:text-white"
          >
            Browse all boards
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative mt-14">
          <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_1.5%,black_98.5%,transparent)]">
            <div className="flex w-max gap-5 pb-8 pt-2 animate-[ps-scroll_90s_linear_infinite] hover:paused">
            {loopBoards.map((board, index) => {
              const rgb = hexToRgb(board.color);
              const classesLabel = formatClasses(board.classes);

              return (
                <Link
                  key={`${board.id}-${index}`}
                  href={`/browse/${board.id}`}
                  className="group relative min-h-[210px] w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.085]"
                  style={{
                    boxShadow: `0 -1px 24px rgba(${rgb}, 0.22), 0 18px 60px rgba(0,0,0,0.24)`,
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: board.color }}
                  />
                  <div
                    className="absolute -right-14 -top-14 size-32 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-45"
                    style={{ backgroundColor: board.color }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:18px_18px] opacity-40" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="grid size-11 place-items-center rounded-xl text-white shadow-lg"
                        style={{
                          backgroundColor: board.color,
                          boxShadow: `0 12px 28px rgba(${rgb}, 0.28)`,
                        }}
                      >
                        <Building2 className="size-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/60">
                        {classesLabel}
                      </span>
                    </div>

                    <p className="mt-6 text-2xl font-semibold tracking-tight text-white">
                      {board.shortName}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      className="border-transparent text-white shadow-sm"
                      style={{ backgroundColor: board.color }}
                    >
                      {formatProvince(board.province)}
                    </Badge>
                    <Badge className="border-white/10 bg-white/10 text-white/72">
                      Classes {classesLabel}
                    </Badge>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/58">
                      {board.description ?? board.name}
                    </p>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
