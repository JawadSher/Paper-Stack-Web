"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQuestion } from "@/src/actions/admin/questions";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateQuestion>[1];
    }) => updateQuestion(id, data),
    onMutate: async ({ id, data }) => {
      const context = await snapshotQueries(
        queryClient,
        queryKeys.questions.all(),
      );
      queryClient.setQueriesData({ queryKey: queryKeys.questions.all() }, (old) =>
        updateEntityInCache(old, id, data),
      );
      queryClient.setQueryData(queryKeys.questions.detail(id), (old) =>
        updateEntityInCache(old, id, data),
      );
      return context;
    },
    onSuccess: (result, _variables, context) => {
      if (!result.success) {
        restoreQueries(queryClient, context);
        toast.error(result.error);
        return;
      }

      toast.success("Question updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to update question: ${error.message}`);
    },
  });
}
