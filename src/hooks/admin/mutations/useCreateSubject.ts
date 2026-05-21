"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubject } from "@/src/actions/admin/subjects";
import { queryKeys } from "@/src/types/query-keys";

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(`Subject "${result.data.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to create subject: ${error.message}`);
    },
  });
}
