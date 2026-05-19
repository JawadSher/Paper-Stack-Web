"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DangerZone } from "@/components/admin/settings/DangerZone";
import { FeatureFlags } from "@/components/admin/settings/FeatureFlags";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { MaintenanceMode } from "@/components/admin/settings/MaintenanceMode";

const tabs = ["General", "Maintenance", "Features", "Danger zone"] as const;

export function SettingsManager() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General");
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="grid h-fit gap-2 rounded-lg border bg-card p-2">
        {tabs.map((item) => <Button key={item} type="button" variant={tab === item ? "default" : "ghost"} className="justify-start" onClick={() => setTab(item)}>{item}</Button>)}
      </nav>
      <section>{tab === "General" ? <GeneralSettings /> : tab === "Maintenance" ? <MaintenanceMode /> : tab === "Features" ? <FeatureFlags /> : <DangerZone />}</section>
    </div>
  );
}
