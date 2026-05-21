"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaperFilters } from "@/src/types/action-types";
import { getPapers } from "@/src/actions/public/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useGetPapers(
  filters: PaperFilters = {},
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: queryKeys.papers.list({ ...filters, page, pageSize }),
    queryFn: async () => {
      const result = await getPapers(filters, page, pageSize);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
