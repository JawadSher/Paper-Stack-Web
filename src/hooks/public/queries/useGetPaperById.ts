"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaperById } from "@/src/actions/public/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useGetPaperById(id: string) {
  return useQuery({
    queryKey: queryKeys.papers.detail(id),
    queryFn: async () => {
      const result = await getPaperById(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}
