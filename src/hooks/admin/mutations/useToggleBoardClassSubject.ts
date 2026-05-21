"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleBoardClassSubject } from "@/src/actions/admin/subjects";
import { queryKeys } from "@/src/types/query-keys";
import {
  restoreQueries,
  snapshotQueries,
  updateEntityInCache,
} from "./_cache";

export function useToggleBoardClassSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      subjectId,
      classLevel,
      isActive,
    }: {
      boardId: string;
      subjectId: string;
      classLevel: number;
      isActive: boolean;
    }) => toggleBoardClassSubject(boardId, subjectId, classLevel, isActive),
    onMutate: async ({ boardId, subjectId, classLevel, isActive }) => {
      const context = await snapshotQueries(
        queryClient,
        queryKeys.subjects.all(),
      );
      queryClient.setQueriesData({ queryKey: queryKeys.subjects.all() }, (old) =>
        updateEntityInCache(old, subjectId, { isActive }),
      );
      queryClient.setQueryData(
        queryKeys.subjects.byBoardClass(boardId, classLevel),
        (old) => updateEntityInCache(old, subjectId, { isActive }),
      );
      return context;
    },
    onSuccess: (result, variables, context) => {
      if (!result.success) {
        restoreQueries(queryClient, context);
        toast.error(result.error);
        return;
      }

      toast.success(variables.isActive ? "Subject enabled" : "Subject disabled");
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.byBoardClass(
          variables.boardId,
          variables.classLevel,
        ),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      restoreQueries(queryClient, context);
      toast.error(`Failed to toggle subject: ${error.message}`);
    },
  });
}
