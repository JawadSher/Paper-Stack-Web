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
import type { Board } from "@/types";

function toBoardProvince(province: string): Board["province"] {
  return province === "Gilgit_Baltistan"
    ? "Gilgit-Baltistan"
    : (province as Board["province"]);
}

function toFileSizeBytes(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;

  const bytes = Number(value);
  return Number.isFinite(bytes) ? bytes : undefined;
}

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
      search: filters.q.trim() || undefined,
    }),
    [filters, pageFilters],
  );
  const { data, isLoading } = useGetAdminPapers(adminFilters);

  const papers = useMemo(() => {
    return (
      data?.data.map<AdminPaper>((paper) => ({
        id: paper.id,
        title: paper.title,
        boardId: paper.boardId,
        subjectId: paper.subjectId,
        classLevel: paper.classLevel as AdminPaper["classLevel"],
        year: paper.year,
        session: paper.session,
        pdfUrl: paper.pdfUrl ?? "#",
        fileSizeBytes: toFileSizeBytes(paper.fileSizeBytes),
        createdAt: paper.createdAt.toISOString(),
        updatedAt: paper.updatedAt.toISOString(),
        status: paper.status.toLowerCase() as PaperStatus,
        fileName: paper.storagePath?.split("/").at(-1) ?? `${paper.id}.pdf`,
        board: {
          id: paper.board.id,
          name: paper.board.name,
          shortName: paper.board.shortName,
          description: "",
          province: toBoardProvince(paper.board.province),
          classes: paper.board.classes as Board["classes"],
          color: paper.board.color,
        },
        subject: {
          id: paper.subject.id,
          name: paper.subject.name,
          classLevel: paper.classLevel as AdminPaper["classLevel"],
        },
      })) ?? []
    );
  }, [data]);

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
          totalCount={data?.total ?? 0}
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? pageFilters.pageSize ?? 20}
          onPageChange={(page) => setPageFilters((current) => ({ ...current, page }))}
          onPageSizeChange={(pageSize) =>
            setPageFilters((current) => ({ ...current, page: 1, pageSize }))
          }
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
