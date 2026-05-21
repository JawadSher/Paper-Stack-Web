"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

export async function getFeatureFlags(): Promise<
  ActionResult<Record<string, boolean>>
> {
  try {
    const flags = await prisma.featureFlag.findMany();
    const data = flags.reduce<Record<string, boolean>>((acc, flag) => {
      acc[flag.flagName] = flag.isEnabled;
      return acc;
    }, {});

    return ok(data);
  } catch (e) {
    return fail(`Failed to fetch feature flags: ${e}`);
  }
}

export async function getAppSettings(): Promise<
  ActionResult<Record<string, unknown>>
> {
  try {
    const settings = await prisma.appSetting.findMany();
    const data = settings.reduce<Record<string, unknown>>((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return ok(data);
  } catch (e) {
    return fail(`Failed to fetch app settings: ${e}`);
  }
}
