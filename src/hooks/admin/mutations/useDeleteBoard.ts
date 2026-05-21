"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBoard } from "@/src/actions/admin/boards";
import { queryKeys } from "@/src/types/query-keys";

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteBoard(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Board deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete board: ${error.message}`);
    },
  });
}
