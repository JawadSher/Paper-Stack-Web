import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Search Papers</h1>
      <div className="mt-8 flex items-center gap-3 rounded-lg border bg-card p-3">
        <Search className="size-5 text-muted-foreground" />
        <Input
          aria-label="Search papers"
          className="border-0 shadow-none focus-visible:ring-0"
          placeholder="Search by board, subject, class, or year"
        />
      </div>
    </section>
  );
}
