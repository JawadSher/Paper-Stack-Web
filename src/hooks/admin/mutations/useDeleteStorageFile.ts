"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStorageFile } from "@/src/actions/admin/media";
import { queryKeys } from "@/src/types/query-keys";

export function useDeleteStorageFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ path }: { path: string }) => deleteStorageFile(path),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("File deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.media.files() });
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });
}
