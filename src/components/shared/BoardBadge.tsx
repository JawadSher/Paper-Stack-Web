import type { Board } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BoardBadgeProps = {
  board: Board;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-xs",
  lg: "h-7 px-3 text-sm",
};

export function BoardBadge({ board, size = "md" }: BoardBadgeProps) {
  return (
    <Badge
      className={cn("border-transparent text-white", sizeClasses[size])}
      style={{ backgroundColor: board.color }}
    >
      {board.shortName}
    </Badge>
  );
}
