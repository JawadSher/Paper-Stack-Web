"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GeneralSettings() {
  return (
    <form className="space-y-4 rounded-lg border bg-card p-5" onSubmit={(event) => { event.preventDefault(); console.log("save general settings"); toast.success("General settings saved"); }}>
      {["App name", "App tagline", "Contact email", "Twitter/X URL", "Instagram URL", "Google Play link", "App Store link"].map((label, index) => (
        <div key={label} className="space-y-2">
          <Label>{label}</Label>
          <Input defaultValue={index === 0 ? "PaperStack" : index === 1 ? "Every past paper. One place." : ""} />
        </div>
      ))}
      <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90">Save settings</Button>
    </form>
  );
}
