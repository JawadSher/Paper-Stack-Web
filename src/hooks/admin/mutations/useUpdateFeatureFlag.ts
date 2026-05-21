"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateFeatureFlag } from "@/src/actions/admin/settings";
import { queryKeys } from "@/src/types/query-keys";

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      flagName,
      isEnabled,
    }: {
      flagName: string;
      isEnabled: boolean;
    }) => updateFeatureFlag(flagName, isEnabled),
    onMutate: async ({ flagName, isEnabled }) => {
      const queryKey = queryKeys.settings.featureFlags();
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<Record<string, boolean>>(queryKey, (old) => ({
        ...old,
        [flagName]: isEnabled,
      }));
      return { previous };
    },
    onSuccess: (result, variables, context) => {
      if (!result.success) {
        queryClient.setQueryData(
          queryKeys.settings.featureFlags(),
          context?.previous,
        );
        toast.error(result.error);
        return;
      }

      toast.success(
        `"${variables.flagName}" ${
          variables.isEnabled ? "enabled" : "disabled"
        }`,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.featureFlags(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit.list({}) });
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(queryKeys.settings.featureFlags(), context?.previous);
      toast.error(`Failed to update feature flag: ${error.message}`);
    },
  });
}
