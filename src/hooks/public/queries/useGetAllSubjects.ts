"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSubjects } from "@/src/actions/public/subjects";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAllSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: async () => {
      const result = await getAllSubjects();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
