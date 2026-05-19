"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SearchBarProps = {
  onSearch: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  className?: string;
};

export function SearchBar({
  onSearch,
  autoFocus = false,
  placeholder = "Search papers",
  initialValue = "",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = window.setTimeout(() => onSearch(value), 300);
    return () => window.clearTimeout(timeout);
  }, [onSearch, value]);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-colors focus-within:border-ps-coral",
        className,
      )}
    >
      <Search className="size-5 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0 px-4"
      />
    </div>
  );
}
