"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaperFilters } from "@/src/types/action-types";
import { getPapersBySubject } from "@/src/actions/public/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useGetPapersBySubject(
  boardId: string,
  subjectId: string,
  classLevel: number,
  yearFilter?: number,
  sessionFilter?: PaperFilters["session"],
) {
  return useQuery({
    queryKey: queryKeys.papers.list({
      boardId,
      subjectId,
      classLevel,
      year: yearFilter,
      session: sessionFilter,
    }),
    queryFn: async () => {
      const result = await getPapersBySubject(
        boardId,
        subjectId,
        classLevel,
        yearFilter,
        sessionFilter,
      );
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!boardId && !!subjectId && !!classLevel,
  });
}
