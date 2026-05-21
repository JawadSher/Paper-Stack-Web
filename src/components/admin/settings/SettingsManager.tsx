"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DangerZone } from "@/components/admin/settings/DangerZone";
import { FeatureFlags } from "@/components/admin/settings/FeatureFlags";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { MaintenanceMode } from "@/components/admin/settings/MaintenanceMode";
import { useUpdateFeatureFlag } from "@/hooks/admin/mutations/useUpdateFeatureFlag";
import { useUpdateSetting } from "@/hooks/admin/mutations/useUpdateSetting";
import { useGetAppSettings } from "@/hooks/public/queries/useGetAppSettings";
import { useGetFeatureFlags } from "@/hooks/public/queries/useGetFeatureFlags";

const tabs = ["General", "Maintenance", "Features", "Danger zone"] as const;

export function SettingsManager() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General");
  const { data: flags } = useGetFeatureFlags();
  const { data: settings } = useGetAppSettings();
  const updateFlag = useUpdateFeatureFlag();
  const updateSetting = useUpdateSetting();

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="grid h-fit gap-2 rounded-lg border bg-card p-2">
        {tabs.map((item) => <Button key={item} type="button" variant={tab === item ? "default" : "ghost"} className="justify-start" onClick={() => setTab(item)}>{item}</Button>)}
      </nav>
      <section>
        {tab === "General" ? (
          <GeneralSettings settings={settings} updateSetting={updateSetting} />
        ) : tab === "Maintenance" ? (
          <MaintenanceMode
            settings={settings}
            updateFlag={updateFlag}
            updateSetting={updateSetting}
          />
        ) : tab === "Features" ? (
          <FeatureFlags flags={flags} updateFlag={updateFlag} />
        ) : (
          <DangerZone />
        )}
      </section>
    </div>
  );
}
