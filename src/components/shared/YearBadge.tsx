import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type YearBadgeProps = {
  year: number;
  className?: string;
};

export function YearBadge({ year, className }: YearBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("font-mono", className)}>
      {year}
    </Badge>
  );
}
