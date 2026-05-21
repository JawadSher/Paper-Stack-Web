"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSubject } from "@/src/actions/admin/subjects";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateSubject>[1];
    }) => updateSubject(id, data),
    onMutate: async ({ id, data }) => {
      const context = await snapshotQueries(
        queryClient,
        queryKeys.subjects.all(),
      );
      queryClient.setQueriesData({ queryKey: queryKeys.subjects.all() }, (old) =>
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

      toast.success("Subject updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to update subject: ${error.message}`);
    },
  });
}
