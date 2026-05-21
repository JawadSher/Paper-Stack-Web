"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { PaperFilters, getFiltersFromParams } from "@/components/admin/papers/PaperFilters";
import { PapersTable } from "@/components/admin/papers/PapersTable";
import { useBulkDeletePapers } from "@/hooks/admin/mutations/useBulkDeletePapers";
import { useDeletePaper } from "@/hooks/admin/mutations/useDeletePaper";
import { useUpdatePaperStatus } from "@/hooks/admin/mutations/useUpdatePaperStatus";
import { useGetAdminPapers } from "@/hooks/admin/queries/useGetAdminPapers";
import type { AdminPaperFilters } from "@/src/types/action-types";
import type { AdminPaper, PaperStatus } from "@/constants/admin-papers";

export type PapersListClientProps = Record<string, never>;

export function PapersListClient({}: PapersListClientProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams));
  const [pageFilters, setPageFilters] = useState<AdminPaperFilters>({
    page: 1,
    pageSize: 20,
  });
  const updateStatus = useUpdatePaperStatus();
  const deletePaper = useDeletePaper();
  const bulkDelete = useBulkDeletePapers();

  const adminFilters = useMemo<AdminPaperFilters>(
    () => ({
      ...pageFilters,
      boardId: filters.boardId === "all" ? undefined : filters.boardId,
      classLevel:
        filters.classLevel === "all" ? undefined : Number(filters.classLevel),
      subjectId: filters.subjectId === "all" ? undefined : filters.subjectId,
      year: filters.year === "all" ? undefined : Number(filters.year),
      session:
        filters.session === "all"
          ? undefined
          : (filters.session as AdminPaperFilters["session"]),
    }),
    [filters, pageFilters],
  );
  const { data, isLoading } = useGetAdminPapers(adminFilters);

  const papers = useMemo(() => {
    const normalized = filters.q.trim().toLowerCase();
    const mapped =
      data?.data.map<AdminPaper>((paper) => ({
        id: paper.id,
        title: paper.title,
        boardId: paper.boardId,
        subjectId: paper.subjectId,
        classLevel: paper.classLevel as AdminPaper["classLevel"],
        year: paper.year,
        session: paper.session,
        pdfUrl: paper.pdfUrl ?? "#",
        fileSizeBytes: paper.fileSizeBytes ? Number(paper.fileSizeBytes) : undefined,
        createdAt: paper.createdAt.toISOString(),
        updatedAt: paper.updatedAt.toISOString(),
        status: paper.status.toLowerCase() as PaperStatus,
        fileName: paper.storagePath?.split("/").at(-1) ?? `${paper.id}.pdf`,
      })) ?? [];

    return mapped.filter((paper) => {
      const searchable = [
        paper.title,
        paper.year,
        paper.session,
      ]
        .join(" ")
        .toLowerCase();

      return !normalized || searchable.includes(normalized);
    });
  }, [data, filters.q]);

  return (
    <div className="space-y-4">
      <PaperFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPageFilters((current) => ({ ...current, page: 1 }));
        }}
      />
      {isLoading ? (
        <div className="space-y-2 rounded-lg border bg-card p-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <PapersTable
          papers={papers}
          totalPages={data?.totalPages ?? 1}
          page={data?.page ?? 1}
          onPageChange={(page) => setPageFilters((current) => ({ ...current, page }))}
          onStatusChange={(id, status) =>
            updateStatus.mutate({
              id,
              status: status === "live" ? "LIVE" : "DRAFT",
            })
          }
          onDelete={(paper) =>
            deletePaper.mutate({ id: paper.id, title: paper.title })
          }
          onBulkDelete={(ids) => bulkDelete.mutate({ ids })}
        />
      )}
    </div>
  );
}
