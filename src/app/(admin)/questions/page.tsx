import Link from "next/link";
import { Plus } from "lucide-react";
import { QuestionsManager } from "@/components/admin/questions/QuestionsManager";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Common questions" subtitle="Tag and manage repeated exam questions" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Questions", href: "/questions" }]} actions={<Link href="/questions/new" className={cn(buttonVariants(), "bg-ps-coral hover:bg-ps-coral/90")}><Plus className="size-4" />Add question</Link>} />
      <QuestionsManager />
    </div>
  );
}
