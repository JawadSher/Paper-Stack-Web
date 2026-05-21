"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

export async function updateFeatureFlag(
  flagName: string,
  isEnabled: boolean,
): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.featureFlag.findUnique({
      where: { flagName },
    });
    if (!existing) return fail("Feature flag not found");

    const updated = await prisma.featureFlag.update({
      where: { flagName },
      data: { isEnabled, updatedBy: adminUserId },
    });
    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "feature_flag",
      entityId: updated.id,
      oldValue: existing,
      newValue: updated,
    });

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function updateSetting(
  key: string,
  value: Prisma.InputJsonValue,
): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.appSetting.findUnique({ where: { key } });
    const setting = await prisma.appSetting.upsert({
      where: { key },
      create: { key, value, updatedBy: adminUserId },
      update: { value, updatedBy: adminUserId },
    });

    await writeAudit({
      adminUserId,
      action: existing ? "update" : "create",
      entityType: "app_setting",
      entityId: setting.id,
      oldValue: existing ?? undefined,
      newValue: setting,
    });

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}
