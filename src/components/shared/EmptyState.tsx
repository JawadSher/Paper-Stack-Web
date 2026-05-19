import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "page" | "card";
};

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = "page",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center text-center",
        variant === "page" ? "min-h-[50vh] p-8" : "p-8",
      )}
    >
      <div className="grid max-w-md justify-items-center gap-4">
        <div className="grid size-12 place-items-center rounded-lg bg-secondary text-ps-coral">
          <Icon className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {actionLabel && onAction ? (
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
