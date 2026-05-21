"use client";

import type { QueryClient, QueryKey } from "@tanstack/react-query";

type Entity = { id: string };
type RollbackEntry = [QueryKey, unknown];
export type RollbackContext = { previous: RollbackEntry[] };

function isEntity(value: unknown): value is Entity {
  return typeof value === "object" && value !== null && "id" in value;
}

function hasDataArray(value: unknown): value is { data: Entity[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as { data?: unknown }).data)
  );
}

export function updateEntityInCache<T extends object>(
  old: unknown,
  id: string,
  data: T,
) {
  if (Array.isArray(old)) {
    return old.map((item) =>
      isEntity(item) && item.id === id ? { ...item, ...data } : item,
    );
  }

  if (hasDataArray(old)) {
    return {
      ...old,
      data: old.data.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    };
  }

  if (isEntity(old) && old.id === id) {
    return { ...old, ...data };
  }

  return old;
}

export function removeEntityFromCache(old: unknown, id: string) {
  if (Array.isArray(old)) {
    return old.filter((item) => !isEntity(item) || item.id !== id);
  }

  if (hasDataArray(old)) {
    return {
      ...old,
      data: old.data.filter((item) => item.id !== id),
    };
  }

  if (isEntity(old) && old.id === id) {
    return undefined;
  }

  return old;
}

export async function snapshotQueries(
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<RollbackContext> {
  await queryClient.cancelQueries({ queryKey });
  return { previous: queryClient.getQueriesData({ queryKey }) };
}

export function restoreQueries(
  queryClient: QueryClient,
  context?: RollbackContext,
) {
  context?.previous.forEach(([key, value]) => {
    queryClient.setQueryData(key, value);
  });
}
