"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchFilters } from "@/src/types/action-types";
import { searchPapers } from "@/src/actions/public/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useSearchPapers(query: string, filters: SearchFilters = {}) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: queryKeys.papers.search(debouncedQuery, filters),
    queryFn: async () => {
      const result = await searchPapers(debouncedQuery, filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 30 * 1000,
  });
}
