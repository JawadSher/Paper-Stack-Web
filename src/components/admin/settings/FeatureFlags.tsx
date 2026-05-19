"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const features = [
  ["Common questions", "Show the common questions feature across all subjects"],
  ["PDF downloads", "Allow users to download PDFs"],
  ["Web PDF viewer", "Show embedded PDF viewer on web (disable to save bandwidth)"],
  ["Search", "Enable global search"],
  ["New papers notification", "Send push notifications when new papers are added"],
] as const;

export function FeatureFlags() {
  const [disabled, setDisabled] = useState<string[]>([]);
  return (
    <div className="space-y-3">
      {features.map(([name, description]) => {
        const on = !disabled.includes(name);
        return (
          <div key={name} className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">{description}</p><p className="mt-1 text-xs text-muted-foreground">Last changed just now</p></div>
            <Button type="button" variant={on ? "default" : "outline"} onClick={() => setDisabled((items) => on ? [...items, name] : items.filter((item) => item !== name))}>{on ? "ON" : "OFF"}</Button>
          </div>
        );
      })}
    </div>
  );
}
