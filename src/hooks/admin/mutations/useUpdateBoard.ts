"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBoard } from "@/src/actions/admin/boards";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateBoard>[1];
    }) => updateBoard(id, data),
    onMutate: async ({ id, data }) => {
      const context = await snapshotQueries(queryClient, queryKeys.boards.all());
      queryClient.setQueriesData({ queryKey: queryKeys.boards.all() }, (old) =>
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

      toast.success("Board updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to update board: ${error.message}`);
    },
  });
}
