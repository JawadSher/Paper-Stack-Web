"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteQuestion } from "@/src/actions/admin/questions";
import { queryKeys } from "@/src/types/query-keys";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteQuestion(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Question deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete question: ${error.message}`);
    },
  });
}
