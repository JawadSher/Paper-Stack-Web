"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkDeletePapers } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useBulkDeletePapers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => bulkDeletePapers(ids),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(`${variables.ids.length} papers deleted`);
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.media.files() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete papers: ${error.message}`);
    },
  });
}
