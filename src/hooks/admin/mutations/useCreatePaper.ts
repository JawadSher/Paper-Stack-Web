"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPaper } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useCreatePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaper,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Paper created - upload PDF to make it live");
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to create paper: ${error.message}`);
    },
  });
}
