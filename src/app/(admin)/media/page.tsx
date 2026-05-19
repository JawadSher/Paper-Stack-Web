import { MediaBrowser } from "@/components/admin/media/MediaBrowser";
import { PageHeader } from "@/components/shared/PageHeader";

export default function MediaPage() {
  return <div className="space-y-6"><PageHeader title="Media" subtitle="All uploaded PDFs and files" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Media", href: "/media" }]} /><MediaBrowser /></div>;
}
