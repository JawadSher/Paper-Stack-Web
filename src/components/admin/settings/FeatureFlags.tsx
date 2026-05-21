"use client";

import { Button } from "@/components/ui/button";
import type { useUpdateFeatureFlag } from "@/hooks/admin/mutations/useUpdateFeatureFlag";

const features = [
  ["commonQuestions", "Common questions", "Show the common questions feature across all subjects"],
  ["pdfDownloads", "PDF downloads", "Allow users to download PDFs"],
  ["webPdfViewer", "Web PDF viewer", "Show embedded PDF viewer on web (disable to save bandwidth)"],
  ["search", "Search", "Enable global search"],
  ["newPapersNotification", "New papers notification", "Send push notifications when new papers are added"],
] as const;

export function FeatureFlags({
  flags,
  updateFlag,
}: {
  flags?: Record<string, boolean>;
  updateFlag: ReturnType<typeof useUpdateFeatureFlag>;
}) {
  return (
    <div className="space-y-3">
      {features.map(([flagName, name, description]) => {
        const on = flags?.[flagName] ?? false;
        return (
          <div key={name} className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">{description}</p><p className="mt-1 text-xs text-muted-foreground">Last changed just now</p></div>
            <Button
              type="button"
              variant={on ? "default" : "outline"}
              disabled={updateFlag.isPending}
              onClick={() =>
                updateFlag.mutate({ flagName, isEnabled: !on })
              }
            >
              {on ? "ON" : "OFF"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
