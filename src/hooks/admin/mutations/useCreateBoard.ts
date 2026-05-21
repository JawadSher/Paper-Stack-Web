"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBoard } from "@/src/actions/admin/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(`Board "${result.data.shortName}" created successfully`);
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Unexpected error: ${error.message}`);
    },
  });
}
