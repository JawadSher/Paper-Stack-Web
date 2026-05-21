"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function toAuditJson(value?: object) {
  if (!value) return undefined;

  return JSON.parse(
    JSON.stringify(value, (_key, nestedValue) =>
      typeof nestedValue === "bigint" ? nestedValue.toString() : nestedValue,
    ),
  );
}

export async function writeAudit({
  adminUserId,
  action,
  entityType,
  entityId,
  oldValue,
  newValue,
}: {
  adminUserId: string;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId?: string;
  oldValue?: object;
  newValue?: object;
}) {
  await prisma.adminAuditLog.create({
    data: {
      adminUserId,
      action,
      entityType,
      entityId,
      oldValue: toAuditJson(oldValue),
      newValue: toAuditJson(newValue),
    },
  });
}

export async function actionError(error: unknown): Promise<string> {
  return error instanceof Error ? error.message : String(error);
}
