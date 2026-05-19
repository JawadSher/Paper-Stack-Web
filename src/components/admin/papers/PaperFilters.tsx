"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { ClassLevel, Paper } from "@/types";

export type PaperFilterState = {
  q: string;
  boardId: string;
  classLevel: string;
  subjectId: string;
  year: string;
  session: string;
};

export type PaperFiltersProps = {
  value: PaperFilterState;
  onChange: (value: PaperFilterState) => void;
};

const years = [2024, 2023, 2022, 2021, 2020, 2019];
const sessions: Array<NonNullable<Paper["session"]>> = [
  "annual",
  "supplementary",
  "model",
];

const emptyFilters: PaperFilterState = {
  q: "",
  boardId: "all",
  classLevel: "all",
  subjectId: "all",
  year: "all",
  session: "all",
};

export function getFiltersFromParams(params: URLSearchParams): PaperFilterState {
  return {
    q: params.get("q") ?? "",
    boardId: params.get("boardId") ?? "all",
    classLevel: params.get("classLevel") ?? "all",
    subjectId: params.get("subjectId") ?? "all",
    year: params.get("year") ?? "all",
    session: params.get("session") ?? "all",
  };
}

export function PaperFilters({ value, onChange }: PaperFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(value.q);

  const filteredSubjects = useMemo(() => {
    if (value.classLevel === "all") return subjects;
    return subjects.filter(
      (subject) => subject.classLevel === Number(value.classLevel),
    );
  }, [value.classLevel]);

  useEffect(() => {
    setSearch(value.q);
  }, [value.q]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search !== value.q) {
        updateFilters({ q: search });
      }
    }, 250);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateFilters(patch: Partial<PaperFilterState>) {
    const next = { ...value, ...patch };

    if (patch.classLevel && patch.classLevel !== value.classLevel) {
      next.subjectId = "all";
    }

    onChange(next);

    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, entry]) => {
      if (!entry || entry === "all") params.delete(key);
      else params.set(key, entry);
    });

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setSearch("");
    onChange(emptyFilters);
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr_1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subject, board, year"
            className="pl-9"
          />
        </div>

        <Select
          value={value.boardId}
          onValueChange={(boardId) => updateFilters({ boardId: boardId ?? "all" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Board" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All boards</SelectItem>
            {boards.map((board) => (
              <SelectItem key={board.id} value={board.id}>
                {board.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.classLevel}
          onValueChange={(classLevel) =>
            updateFilters({ classLevel: classLevel ?? "all" })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {[9, 10, 11, 12].map((classLevel) => (
              <SelectItem key={classLevel} value={String(classLevel)}>
                Class {classLevel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.subjectId}
          onValueChange={(subjectId) =>
            updateFilters({ subjectId: subjectId ?? "all" })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {filteredSubjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name} {value.classLevel === "all" ? `(${subject.classLevel})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.year}
          onValueChange={(year) => updateFilters({ year: year ?? "all" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.session}
          onValueChange={(session) =>
            updateFilters({ session: session ?? "all" })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sessions</SelectItem>
            {sessions.map((session) => (
              <SelectItem key={session} value={session}>
                {session === "supplementary" ? "Supplementary" : session[0].toUpperCase() + session.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" variant="ghost" onClick={clearFilters}>
          <RotateCcw className="size-4" />
          Clear filters
        </Button>
      </div>
    </div>
  );
}

export const defaultPaperFilters = emptyFilters;
export type PaperFilterClassLevel = ClassLevel;
