"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "@/src/actions/public/settings";
import { queryKeys } from "@/src/types/query-keys";

export function useGetFeatureFlags() {
  return useQuery({
    queryKey: queryKeys.settings.featureFlags(),
    queryFn: async () => {
      const result = await getFeatureFlags();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
