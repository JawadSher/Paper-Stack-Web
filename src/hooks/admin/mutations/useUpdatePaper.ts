"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePaper } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useUpdatePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updatePaper>[1];
    }) => updatePaper(id, data),
    onMutate: async ({ id, data }) => {
      const context = await snapshotQueries(queryClient, queryKeys.papers.all());
      queryClient.setQueriesData({ queryKey: queryKeys.papers.all() }, (old) =>
        updateEntityInCache(old, id, data),
      );
      queryClient.setQueryData(queryKeys.papers.detail(id), (old) =>
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

      toast.success("Paper updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to update paper: ${error.message}`);
    },
  });
}
