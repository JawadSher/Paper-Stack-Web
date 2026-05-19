import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaperStatus } from "@/constants/admin-papers";

export type PaperStatusBadgeProps = {
  status: PaperStatus;
};

const statusStyles = {
  live: "bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-300",
  draft: "bg-muted text-muted-foreground",
  processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
};

const labels = {
  live: "Live",
  draft: "Draft",
  processing: "Processing",
};

export function PaperStatusBadge({ status }: PaperStatusBadgeProps) {
  return (
    <Badge className={cn("border-transparent", statusStyles[status])}>
      {labels[status]}
    </Badge>
  );
}
