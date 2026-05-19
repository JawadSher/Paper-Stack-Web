import { BoardsBrowser } from "@/components/public/browse/BoardsBrowser";
import { PageHeader } from "@/components/shared/PageHeader";

export default function BrowsePage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Browse past papers"
        subtitle="Select your board to get started"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Browse", href: "/browse" }]}
      />
      <div className="mt-8">
        <BoardsBrowser />
      </div>
    </section>
  );
}
