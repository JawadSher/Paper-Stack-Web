"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePaper } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useDeletePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; title?: string }) => deletePaper(id),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        variables.title ? `Paper "${variables.title}" deleted` : "Paper deleted",
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.media.files() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete paper: ${error.message}`);
    },
  });
}
