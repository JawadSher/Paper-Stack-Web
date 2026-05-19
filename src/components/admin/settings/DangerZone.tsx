"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const actions = [
  "Clear all paper history",
  "Rebuild search index",
  "Export all data",
] as const;

export function DangerZone() {
  const [confirm, setConfirm] = useState("");
  return (
    <div className="space-y-4 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
      <h2 className="font-semibold text-destructive">Danger zone</h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <ConfirmAction key={action} label={action} />
        ))}
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="font-medium">Wipe all papers</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Type DELETE to confirm.
        </p>
        <Input
          className="mt-3 max-w-xs"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button
          type="button"
          variant="destructive"
          className="m-2"
          disabled={confirm !== "DELETE"}
          onClick={() => toast.success("Wipe all papers queued")}
        >
          Wipe all papers
        </Button>
      </div>
    </div>
  );
}

function ConfirmAction({ label }: { label: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="outline">
            {label}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will be simulated for now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => toast.success(`${label} queued`)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
