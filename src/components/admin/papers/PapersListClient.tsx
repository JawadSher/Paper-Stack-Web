"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperFilters, getFiltersFromParams } from "@/components/admin/papers/PaperFilters";
import { PapersTable } from "@/components/admin/papers/PapersTable";
import { adminPapers } from "@/constants/admin-papers";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export type PapersListClientProps = Record<string, never>;

export function PapersListClient({}: PapersListClientProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams));

  const filteredPapers = useMemo(() => {
    const normalized = filters.q.trim().toLowerCase();

    return adminPapers.filter((paper) => {
      const board = boards.find((item) => item.id === paper.boardId);
      const subject = subjects.find((item) => item.id === paper.subjectId);
      const searchable = [
        paper.title,
        paper.year,
        paper.session,
        board?.name,
        board?.shortName,
        subject?.name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalized || searchable.includes(normalized)) &&
        (filters.boardId === "all" || paper.boardId === filters.boardId) &&
        (filters.classLevel === "all" ||
          paper.classLevel === Number(filters.classLevel)) &&
        (filters.subjectId === "all" || paper.subjectId === filters.subjectId) &&
        (filters.year === "all" || paper.year === Number(filters.year)) &&
        (filters.session === "all" || paper.session === filters.session)
      );
    });
  }, [filters]);

  return (
    <div className="space-y-4">
      <PaperFilters value={filters} onChange={setFilters} />
      <PapersTable papers={filteredPapers} />
    </div>
  );
}
