import { Suspense } from "react";
import { SearchClient } from "@/components/public/search/SearchClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

export default function SearchPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Search papers"
        subtitle="Find papers across boards, classes, subjects, years, and sessions."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }]}
      />
      <div className="mt-8">
        <Suspense fallback={<SkeletonCard />}>
          <SearchClient />
        </Suspense>
      </div>
    </section>
  );
}
