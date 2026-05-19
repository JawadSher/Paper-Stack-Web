"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MaintenanceMode() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="space-y-4">
      {enabled ? <div className="flex gap-2 rounded-lg border border-amber-400 bg-amber-100 p-3 text-amber-800"><AlertTriangle className="size-5" />Maintenance mode is currently ON.</div> : null}
      <div className="rounded-lg border bg-card p-5">
        <Button type="button" variant={enabled ? "default" : "outline"} onClick={() => setEnabled((value) => !value)}>
          Maintenance mode {enabled ? "ON" : "OFF"}
        </Button>
        <div className="mt-5 space-y-2"><Label>Maintenance message</Label><Textarea defaultValue="PaperStack is under maintenance. Please check back soon." /></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Start</Label><Input type="datetime-local" /></div><div className="space-y-2"><Label>End</Label><Input type="datetime-local" /></div></div>
      </div>
    </div>
  );
}
