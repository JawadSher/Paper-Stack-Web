"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { useUpdateFeatureFlag } from "@/hooks/admin/mutations/useUpdateFeatureFlag";
import type { useUpdateSetting } from "@/hooks/admin/mutations/useUpdateSetting";

export function MaintenanceMode({
  settings,
  updateFlag,
  updateSetting,
}: {
  settings?: Record<string, unknown>;
  updateFlag: ReturnType<typeof useUpdateFeatureFlag>;
  updateSetting: ReturnType<typeof useUpdateSetting>;
}) {
  const enabled = Boolean(settings?.maintenanceMode);
  return (
    <div className="space-y-4">
      {enabled ? <div className="flex gap-2 rounded-lg border border-amber-400 bg-amber-100 p-3 text-amber-800"><AlertTriangle className="size-5" />Maintenance mode is currently ON.</div> : null}
      <div className="rounded-lg border bg-card p-5">
        <Button
          type="button"
          variant={enabled ? "default" : "outline"}
          disabled={updateFlag.isPending}
          onClick={() =>
            updateSetting.mutate({
              key: "maintenanceMode",
              value: !enabled,
            })
          }
        >
          Maintenance mode {enabled ? "ON" : "OFF"}
        </Button>
        <div className="mt-5 space-y-2"><Label>Maintenance message</Label><Textarea defaultValue={String(settings?.maintenanceMessage ?? "PaperStack is under maintenance. Please check back soon.")} onBlur={(event) => updateSetting.mutate({ key: "maintenanceMessage", value: event.currentTarget.value })} /></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Start</Label><Input type="datetime-local" defaultValue={String(settings?.maintenanceStart ?? "")} onBlur={(event) => updateSetting.mutate({ key: "maintenanceStart", value: event.currentTarget.value })} /></div><div className="space-y-2"><Label>End</Label><Input type="datetime-local" defaultValue={String(settings?.maintenanceEnd ?? "")} onBlur={(event) => updateSetting.mutate({ key: "maintenanceEnd", value: event.currentTarget.value })} /></div></div>
      </div>
    </div>
  );
}
