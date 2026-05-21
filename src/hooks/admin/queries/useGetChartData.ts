"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "@/src/types/action-types";
import { getChartData } from "@/src/actions/admin/analytics";
import { queryKeys } from "@/src/types/query-keys";

export function useGetChartData(range: DateRange) {
  return useQuery({
    queryKey: queryKeys.analytics.charts(range),
    queryFn: async () => {
      const result = await getChartData(range);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
