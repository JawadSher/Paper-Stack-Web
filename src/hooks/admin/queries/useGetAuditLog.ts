"use client";

import { useQuery } from "@tanstack/react-query";
import type { AuditFilters } from "@/src/types/action-types";
import { getAuditLog } from "@/src/actions/admin/media";
import { queryKeys } from "@/src/types/query-keys";

export function useGetAuditLog(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: queryKeys.audit.list(filters),
    queryFn: async () => {
      const result = await getAuditLog(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
