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
import { useSearchPapers } from "@/hooks/public/queries/useSearchPapers";
import type { Board, Paper } from "@/types";
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
  const { data: results, isLoading } = useSearchPapers(query, {
    boardId: filters.boardIds[0],
    classLevel: filters.classLevels[0],
    year: filters.years[0],
    session: filters.sessions[0],
  });

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
    const result =
      results?.data.map((paper) => ({
        paper: {
          id: paper.id,
          title: paper.title,
          boardId: paper.boardId,
          subjectId: paper.subjectId,
          classLevel: paper.classLevel as Paper["classLevel"],
          year: paper.year,
          session: paper.session,
          pdfUrl: paper.pdfUrl ?? "#",
          fileSizeBytes: paper.fileSizeBytes
            ? Number(paper.fileSizeBytes)
            : undefined,
          createdAt: paper.createdAt.toISOString(),
          updatedAt: paper.updatedAt.toISOString(),
        },
        board: {
          id: paper.board.id,
          name: paper.board.name,
          shortName: paper.board.shortName,
          description: "",
          province:
            paper.board.province === "Gilgit_Baltistan"
              ? "Gilgit-Baltistan"
              : paper.board.province,
          classes: [9, 10, 11, 12] as Paper["classLevel"][],
          color: paper.board.color,
        } satisfies Board,
        subject: {
          id: paper.subject.id,
          name: paper.subject.name,
          classLevel: paper.classLevel as Paper["classLevel"],
        },
      })) ?? [];

    return result.sort((a, b) => {
      if (sort === "oldest") return a.paper.year - b.paper.year;
      if (sort === "board") {
        return a.board.shortName.localeCompare(b.board.shortName);
      }
      return b.paper.year - a.paper.year;
    });
  }, [results, sort]);

  const grouped = useMemo(() => {
    return filteredPapers.slice(0, visibleCount).reduce<Record<string, typeof filteredPapers>>(
      (groups, item) => {
        const key = item.subject.name;
        groups[key] = [...(groups[key] ?? []), item];
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

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : filteredPapers.length ? (
            <div className="space-y-8">
              {Object.entries(grouped).map(([subjectName, items]) => (
                <section key={subjectName} className="space-y-3">
                  <h2 className="text-lg font-semibold">{subjectName}</h2>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {items.map(({ paper, board, subject }) => {
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
