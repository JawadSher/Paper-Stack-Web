"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/src/actions/admin/analytics";
import { queryKeys } from "@/src/types/query-keys";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async () => {
      const result = await getDashboardStats();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
