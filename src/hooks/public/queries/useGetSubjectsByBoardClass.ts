"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubjectsByBoardClass } from "@/src/actions/public/subjects";
import { queryKeys } from "@/src/types/query-keys";

export function useGetSubjectsByBoardClass(
  boardId: string,
  classLevel: number,
) {
  return useQuery({
    queryKey: queryKeys.subjects.byBoardClass(boardId, classLevel),
    queryFn: async () => {
      const result = await getSubjectsByBoardClass(boardId, classLevel);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!boardId && !!classLevel,
  });
}
