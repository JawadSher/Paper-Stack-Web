"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadPaperFile } from "@/src/actions/admin/papers";
import { queryKeys } from "@/src/types/query-keys";

export function useUploadPaperFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paperId,
      formData,
    }: {
      paperId: string;
      formData: FormData;
    }) => uploadPaperFile(paperId, formData),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("PDF uploaded - paper is now live");
      queryClient.invalidateQueries({ queryKey: queryKeys.papers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.media.files() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}
