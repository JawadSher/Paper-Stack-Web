"use client";

import type { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSetting } from "@/src/actions/admin/settings";
import { queryKeys } from "@/src/types/query-keys";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      key,
      value,
    }: {
      key: string;
      value: Prisma.InputJsonValue;
    }) => updateSetting(key, value),
    onMutate: async ({ key, value }) => {
      const queryKey = queryKeys.settings.all();
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<Record<string, Prisma.InputJsonValue>>(
        queryKey,
        (old) => ({
          ...old,
          [key]: value,
        }),
      );
      return { previous };
    },
    onSuccess: (result, _variables, context) => {
      if (!result.success) {
        queryClient.setQueryData(queryKeys.settings.all(), context?.previous);
        toast.error(result.error);
        return;
      }

      toast.success("Setting saved");
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(queryKeys.settings.all(), context?.previous);
      toast.error(`Failed to save setting: ${error.message}`);
    },
  });
}
