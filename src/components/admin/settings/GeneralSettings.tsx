"use client";

import type { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { useUpdateSetting } from "@/hooks/admin/mutations/useUpdateSetting";

const fields = [
  ["appName", "App name", "PaperStack"],
  ["appTagline", "App tagline", "Every past paper. One place."],
  ["contactEmail", "Contact email", ""],
  ["twitterUrl", "Twitter/X URL", ""],
  ["instagramUrl", "Instagram URL", ""],
  ["googlePlayLink", "Google Play link", ""],
  ["appStoreLink", "App Store link", ""],
] as const;

export function GeneralSettings({
  settings,
  updateSetting,
}: {
  settings?: Record<string, unknown>;
  updateSetting: ReturnType<typeof useUpdateSetting>;
}) {
  return (
    <form className="space-y-4 rounded-lg border bg-card p-5" onSubmit={(event) => event.preventDefault()}>
      {fields.map(([key, label, fallback]) => (
        <div key={label} className="space-y-2">
          <Label>{label}</Label>
          <Input
            defaultValue={String(settings?.[key] ?? fallback)}
            onBlur={(event) =>
              updateSetting.mutate({
                key,
                value: event.currentTarget.value as Prisma.InputJsonValue,
              })
            }
          />
        </div>
      ))}
      <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90" disabled={updateSetting.isPending}>Save settings</Button>
    </form>
  );
}
