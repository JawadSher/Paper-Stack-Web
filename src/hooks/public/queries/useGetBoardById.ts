"use client";

import { useQuery } from "@tanstack/react-query";
import { getBoardById } from "@/src/actions/public/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useGetBoardById(id: string) {
  return useQuery({
    queryKey: queryKeys.boards.detail(id),
    queryFn: async () => {
      const result = await getBoardById(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}
