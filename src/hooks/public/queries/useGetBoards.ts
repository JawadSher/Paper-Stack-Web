"use client";

import { useQuery } from "@tanstack/react-query";
import type { BoardFilters } from "@/src/types/action-types";
import { getBoards } from "@/src/actions/public/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useGetBoards(filters: BoardFilters = {}) {
  return useQuery({
    queryKey: queryKeys.boards.list(filters),
    queryFn: async () => {
      const result = await getBoards(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
