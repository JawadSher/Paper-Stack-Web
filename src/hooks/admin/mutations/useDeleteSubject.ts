"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSubject } from "@/src/actions/admin/subjects";
import { queryKeys } from "@/src/types/query-keys";

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSubject(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Subject deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete subject: ${error.message}`);
    },
  });
}
