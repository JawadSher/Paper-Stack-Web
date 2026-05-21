"use client";

import type { PaperStatus } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePaperStatus } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useUpdatePaperStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaperStatus }) =>
      updatePaperStatus(id, status),
    onMutate: async ({ id, status }) => {
      const context = await snapshotQueries(queryClient, queryKeys.papers.all());
      queryClient.setQueriesData({ queryKey: queryKeys.papers.all() }, (old) =>
        updateEntityInCache(old, id, { status }),
      );
      queryClient.setQueryData(queryKeys.papers.detail(id), (old) =>
        updateEntityInCache(old, id, { status }),
      );
      return context;
    },
    onSuccess: (result, variables, context) => {
      if (!result.success) {
        restoreQueries(queryClient, context);
        toast.error(result.error);
        return;
      }

      toast.success(
        variables.status === "LIVE" ? "Paper published" : "Paper unpublished",
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to update paper status: ${error.message}`);
    },
  });
}
