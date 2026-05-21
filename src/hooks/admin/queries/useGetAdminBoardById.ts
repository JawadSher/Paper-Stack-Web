"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminBoardById } from "@/src/actions/admin/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAdminBoardById(id: string) {
  return useQuery({
    queryKey: queryKeys.boards.detail(id),
    queryFn: async () => {
      const result = await getAdminBoardById(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}
