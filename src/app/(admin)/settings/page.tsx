import { SettingsManager } from "@/components/admin/settings/SettingsManager";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SettingsPage() {
  return <div className="space-y-6"><PageHeader title="Settings" subtitle="Configure PaperStack app behavior" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }]} /><SettingsManager /></div>;
}
