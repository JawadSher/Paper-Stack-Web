"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { BoardCard } from "@/components/public/browse/BoardCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetBoardsByProvince } from "@/hooks/public/queries/useGetBoardsByProvince";
import type { Board, ClassLevel } from "@/types";

export type BoardsBrowserProps = Record<string, never>;
type BrowseBoard = Board & { paperCount: number };

export function BoardsBrowser({}: BoardsBrowserProps) {
  const [query, setQuery] = useState("");
  const { data: boardsByProvince, isLoading } = useGetBoardsByProvince();

  const groupedBoards = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return Object.entries(boardsByProvince ?? {})
      .map(([province, boards]) => [
        province,
        boards
          .map<BrowseBoard>((board) => ({
            id: board.id,
            name: board.name,
            shortName: board.shortName,
            description: board.description ?? "",
            province:
              board.province === "Gilgit_Baltistan"
                ? "Gilgit-Baltistan"
                : board.province,
            classes: board.classes as ClassLevel[],
            color: board.color,
            paperCount: board.paperCount,
          }))
          .filter((board) =>
            [board.name, board.shortName, board.province]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
          ),
      ] as const)
      .filter(([, boards]) => boards.length > 0);
  }, [boardsByProvince, query]);

  return (
    <div className="space-y-8">
      <SearchBar
        onSearch={setQuery}
        placeholder="Search boards by name or province"
      />
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
      <div className="space-y-10">
        {groupedBoards.map(([province, boards]) => (
          <section key={province} className="space-y-4">
            <div className="sticky top-16 z-10 border-b bg-background/90 py-3 backdrop-blur">
              <h2 className="text-lg font-semibold">{province}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  paperCount={board.paperCount}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      )}
    </div>
  );
}
