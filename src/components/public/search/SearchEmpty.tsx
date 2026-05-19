import { Search } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export type SearchEmptyProps = {
  query?: string;
};

export function SearchEmpty({ query }: SearchEmptyProps) {
  return (
    <EmptyState
      variant="card"
      icon={Search}
      title="No papers found"
      subtitle={
        query
          ? `No results matched "${query}". Try a board, subject, class, or year.`
          : "Search for a board, subject, class, or year to begin."
      }
    />
  );
}
