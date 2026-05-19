"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { BoardCard } from "@/components/public/browse/BoardCard";
import { boardsByProvince } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";

export type BoardsBrowserProps = Record<string, never>;

export function BoardsBrowser({}: BoardsBrowserProps) {
  const [query, setQuery] = useState("");

  const groupedBoards = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return Object.entries(boardsByProvince)
      .map(([province, boards]) => [
        province,
        boards.filter((board) =>
          [board.name, board.shortName, board.province]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        ),
      ] as const)
      .filter(([, boards]) => boards.length > 0);
  }, [query]);

  return (
    <div className="space-y-8">
      <SearchBar
        onSearch={setQuery}
        placeholder="Search boards by name or province"
      />
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
                  paperCount={
                    mockPapers.filter((paper) => paper.boardId === board.id)
                      .length
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
