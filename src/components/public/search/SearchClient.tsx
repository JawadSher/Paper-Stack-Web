"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSidebar, type PaperFilters } from "@/components/shared/FilterSidebar";
import { PaperCard } from "@/components/shared/PaperCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";
import type { Paper } from "@/types";
import { SearchEmpty } from "./SearchEmpty";

export type SearchClientProps = Record<string, never>;

const defaultFilters: PaperFilters = {
  boardIds: [],
  classLevels: [],
  years: [],
  sessions: [],
};

type SortValue = "newest" | "oldest" | "board";

export function SearchClient({}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<PaperFilters>(defaultFilters);
  const [sort, setSort] = useState<SortValue>("newest");
  const [visibleCount, setVisibleCount] = useState(24);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("paperstack:recent-searches");
    if (stored) setRecentSearches(JSON.parse(stored) as string[]);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    router.replace(`/search?${params.toString()}`, { scroll: false });

    if (query.trim()) {
      const next = [query.trim(), ...recentSearches.filter((item) => item !== query.trim())].slice(0, 5);
      setRecentSearches(next);
      window.localStorage.setItem("paperstack:recent-searches", JSON.stringify(next));
    }
    // recentSearches is intentionally not included to avoid rewriting while typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, router, searchParams]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setVisibleCount(24);
  }, []);

  const filteredPapers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = mockPapers.filter((paper) => {
      const board = boards.find((item) => item.id === paper.boardId);
      const subject = subjects.find((item) => item.id === paper.subjectId);
      const searchable = [
        paper.title,
        paper.year,
        paper.classLevel,
        paper.session,
        board?.name,
        board?.shortName,
        subject?.name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalized || searchable.includes(normalized)) &&
        (!filters.boardIds.length || filters.boardIds.includes(paper.boardId)) &&
        (!filters.classLevels.length ||
          filters.classLevels.includes(paper.classLevel)) &&
        (!filters.years.length || filters.years.includes(paper.year)) &&
        (!filters.sessions.length ||
          (paper.session ? filters.sessions.includes(paper.session) : false))
      );
    });

    return result.sort((a, b) => {
      if (sort === "oldest") return a.year - b.year;
      if (sort === "board") {
        const aBoard = boards.find((board) => board.id === a.boardId)?.shortName ?? "";
        const bBoard = boards.find((board) => board.id === b.boardId)?.shortName ?? "";
        return aBoard.localeCompare(bBoard);
      }
      return b.year - a.year;
    });
  }, [filters, query, sort]);

  const grouped = useMemo(() => {
    return filteredPapers.slice(0, visibleCount).reduce<Record<string, Paper[]>>(
      (groups, paper) => {
        const subject = subjects.find((item) => item.id === paper.subjectId);
        const key = subject?.name ?? "Other";
        groups[key] = [...(groups[key] ?? []), paper];
        return groups;
      },
      {},
    );
  }, [filteredPapers, visibleCount]);

  return (
    <div className="space-y-6">
      <SearchBar
        autoFocus
        initialValue={query}
        onSearch={handleSearch}
        placeholder="Search by board, subject, class, or year"
      />

      {recentSearches.length ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Recent:</span>
          {recentSearches.map((item) => (
            <Button key={item} type="button" size="sm" variant="secondary" onClick={() => setQuery(item)}>
              {item}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="flex items-start gap-6">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredPapers.length}
          boards={boards}
        />
        <section className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">{filteredPapers.length} papers found</p>
            <Select value={sort} onValueChange={(value) => setSort(value as SortValue)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="board">Board A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPapers.length ? (
            <div className="space-y-8">
              {Object.entries(grouped).map(([subjectName, papers]) => (
                <section key={subjectName} className="space-y-3">
                  <h2 className="text-lg font-semibold">{subjectName}</h2>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {papers.map((paper) => {
                      const board = boards.find((item) => item.id === paper.boardId);
                      const subject = subjects.find((item) => item.id === paper.subjectId);
                      if (!board) return null;
                      return (
                        <PaperCard
                          key={paper.id}
                          paper={paper}
                          board={board}
                          subject={subject}
                          variant="compact"
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
              {visibleCount < filteredPapers.length ? (
                <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + 24)}>
                  Load more
                </Button>
              ) : null}
            </div>
          ) : (
            <SearchEmpty query={query} />
          )}
        </section>
      </div>
    </div>
  );
}
