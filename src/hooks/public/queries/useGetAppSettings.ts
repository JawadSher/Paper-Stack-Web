"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "@/src/actions/public/settings";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAppSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all(),
    queryFn: async () => {
      const result = await getAppSettings();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
