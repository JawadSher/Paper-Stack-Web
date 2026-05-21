"use client";

import { useQuery } from "@tanstack/react-query";
import type { AdminBoardFilters } from "@/src/types/action-types";
import { getAdminBoards } from "@/src/actions/admin/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAdminBoards(filters: AdminBoardFilters = {}) {
  return useQuery({
    queryKey: queryKeys.boards.admin(filters),
    queryFn: async () => {
      const result = await getAdminBoards(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
