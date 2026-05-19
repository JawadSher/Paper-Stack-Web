import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  icon?: LucideIcon;
};

export function StatsCard({
  label,
  value,
  trend,
  icon: Icon,
}: StatsCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {Icon ? <Icon className="size-5 text-ps-coral" /> : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-semibold">{value}</p>
        {trend ? (
          <p
            className={cn(
              "flex items-center gap-1 text-sm",
              trend.direction === "up" ? "text-ps-teal" : "text-destructive",
            )}
          >
            <TrendIcon className="size-4" />
            {trend.value}%
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
