import { ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionBadge } from "@/components/shared/SessionBadge";
import { cn } from "@/lib/utils";
import type { Paper } from "@/types";

export type PaperListRowProps = {
  paper: Paper;
  selected?: boolean;
  onSelect: () => void;
};

export function PaperListRow({ paper, selected = false, onSelect }: PaperListRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-ps-coral/50",
        selected && "border-ps-coral pl-2 ring-1 ring-ps-coral/25",
      )}
    >
      <span className="w-16 text-2xl font-semibold">{paper.year}</span>
      <span className="flex flex-1 items-center gap-2">
        {paper.session ? <SessionBadge session={paper.session} /> : null}
      </span>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={(event) => event.stopPropagation()}
      >
        <Download className="size-4" />
      </Button>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
