"use client";

import { useQuery } from "@tanstack/react-query";
import type { AdminPaperFilters } from "@/src/types/action-types";
import { getAdminPapers } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAdminPapers(filters: AdminPaperFilters = {}) {
  return useQuery({
    queryKey: queryKeys.papers.admin(filters),
    queryFn: async () => {
      const result = await getAdminPapers(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
