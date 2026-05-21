"use client";

import { useQuery } from "@tanstack/react-query";
import { getStorageFiles } from "@/src/actions/admin/media";
import { queryKeys } from "@/src/types/query-keys";

export function useGetStorageFiles(prefix?: string) {
  return useQuery({
    queryKey: queryKeys.media.files(prefix),
    queryFn: async () => {
      const result = await getStorageFiles(prefix);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
