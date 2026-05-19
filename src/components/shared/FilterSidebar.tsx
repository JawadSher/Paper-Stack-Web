"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Board, ClassLevel, Paper } from "@/types";

export type PaperFilters = {
  boardIds: string[];
  classLevels: ClassLevel[];
  years: number[];
  sessions: NonNullable<Paper["session"]>[];
};

export type FilterSidebarProps = {
  filters: PaperFilters;
  onFiltersChange: (filters: PaperFilters) => void;
  totalResults: number;
  boards?: Board[];
};

const classLevels: ClassLevel[] = [9, 10, 11, 12];
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const sessions: NonNullable<Paper["session"]>[] = [
  "annual",
  "supplementary",
  "model",
];

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function activeFilterCount(filters: PaperFilters) {
  return (
    filters.boardIds.length +
    filters.classLevels.length +
    filters.years.length +
    filters.sessions.length
  );
}

function emptyFilters(): PaperFilters {
  return {
    boardIds: [],
    classLevels: [],
    years: [],
    sessions: [],
  };
}

function FilterContent({
  filters,
  onFiltersChange,
  totalResults,
  boards = [],
}: FilterSidebarProps) {
  const activeCount = activeFilterCount(filters);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Filters</h2>
          <p className="text-sm text-muted-foreground">
            {totalResults} results
          </p>
        </div>
        <Badge variant={activeCount ? "default" : "secondary"}>
          {activeCount}
        </Badge>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Board</h3>
        <div className="grid gap-2">
          {boards.map((board) => (
            <label
              key={board.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={filters.boardIds.includes(board.id)}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    boardIds: toggleValue(filters.boardIds, board.id),
                  })
                }
                className="size-4 accent-ps-coral"
              />
              {board.shortName}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Class</h3>
        <div className="grid grid-cols-4 gap-2">
          {classLevels.map((classLevel) => (
            <Button
              key={classLevel}
              type="button"
              size="sm"
              variant={
                filters.classLevels.includes(classLevel) ? "default" : "outline"
              }
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  classLevels: toggleValue(filters.classLevels, classLevel),
                })
              }
            >
              {classLevel}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Year</h3>
        <div className="grid grid-cols-2 gap-2">
          {years.map((year) => (
            <label
              key={year}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={filters.years.includes(year)}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    years: toggleValue(filters.years, year),
                  })
                }
                className="size-4 accent-ps-coral"
              />
              {year}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Session type</h3>
        <div className="flex flex-wrap gap-2">
          {sessions.map((session) => (
            <Button
              key={session}
              type="button"
              size="sm"
              variant={filters.sessions.includes(session) ? "default" : "outline"}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  sessions: toggleValue(filters.sessions, session),
                })
              }
              className="capitalize"
            >
              {session === "supplementary" ? "Supp" : session}
            </Button>
          ))}
        </div>
      </section>

      <div className="mt-auto grid gap-2">
        <Button type="button">Apply filters</Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onFiltersChange(emptyFilters())}
        >
          <X className="size-4" />
          Clear all
        </Button>
      </div>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 rounded-lg border bg-card p-4 lg:block">
        <FilterContent {...props} />
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button type="button" variant="outline">
                <SlidersHorizontal className="size-4" />
                Filters
                <Badge className={cn("ml-1", !activeFilterCount(props.filters) && "hidden")}>
                  {activeFilterCount(props.filters)}
                </Badge>
              </Button>
            }
          />
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Narrow the paper list by board, class, year, and session.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <FilterContent {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
