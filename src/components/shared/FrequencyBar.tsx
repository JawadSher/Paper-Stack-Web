"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type FrequencyBarProps = {
  frequency: number;
  totalYears?: number;
  showLabel?: boolean;
};

function frequencyColor(frequency: number) {
  if (frequency >= 5) return "bg-green-500";
  if (frequency >= 4) return "bg-ps-teal";
  if (frequency >= 3) return "bg-ps-coral";
  return "bg-muted-foreground";
}

export function FrequencyBar({
  frequency,
  totalYears = 5,
  showLabel = true,
}: FrequencyBarProps) {
  const [mounted, setMounted] = useState(false);
  const percent = Math.min(100, Math.max(0, (frequency / totalYears) * 100));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            frequencyColor(frequency),
          )}
          style={{ width: mounted ? `${percent}%` : "0%" }}
        />
      </div>
      {showLabel ? (
        <span className="w-10 text-right text-xs text-muted-foreground">
          {frequency}/{totalYears}
        </span>
      ) : null}
    </div>
  );
}
