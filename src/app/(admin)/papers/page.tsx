import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PapersListClient } from "@/components/admin/papers/PapersListClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { cn } from "@/lib/utils";

export default function PapersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Papers"
        subtitle="Manage all past papers in the system"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Papers", href: "/papers" }]}
        actions={
          <Link
            href="/papers/new"
            className={cn(buttonVariants(), "bg-ps-coral hover:bg-ps-coral/90")}
          >
            <Plus className="size-4" />
            Upload paper
          </Link>
        }
      />
      <Suspense fallback={<SkeletonCard />}>
        <PapersListClient />
      </Suspense>
    </div>
  );
}
