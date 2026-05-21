"use client";

import { useQuery } from "@tanstack/react-query";
import type { QuestionFilters } from "@/src/types/action-types";
import { getCommonQuestions } from "@/src/actions/public/questions";
import { queryKeys } from "@/src/types/query-keys";

export function useGetCommonQuestions(filters: QuestionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.questions.list(filters),
    queryFn: async () => {
      const result = await getCommonQuestions(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!filters.subjectId,
  });
}
