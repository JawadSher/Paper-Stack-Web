"use client";

import { useQuery } from "@tanstack/react-query";
import { getBoardsByProvince } from "@/src/actions/public/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useGetBoardsByProvince() {
  return useQuery({
    queryKey: queryKeys.boards.byProvince(),
    queryFn: async () => {
      const result = await getBoardsByProvince();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}
