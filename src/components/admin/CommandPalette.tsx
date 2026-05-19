"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, Plus, Upload } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { adminNavItems } from "./admin-nav";

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const recentPapers = [
  "Physics 2024 Annual",
  "Chemistry 2023 Supplementary",
  "Mathematics 2022 Annual",
];

const quickActions = [
  { label: "Upload new paper", href: "/papers", icon: Upload },
  { label: "Add board", href: "/boards", icon: Plus },
  { label: "Add subject", href: "/subjects", icon: FilePlus2 },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  function runCommand(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search admin actions..." />
        <CommandList>
          <CommandEmpty>No command found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {adminNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                  <Icon className="size-4" />
                  {item.label}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick actions">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <CommandItem key={action.label} onSelect={() => runCommand(action.href)}>
                  <Icon className="size-4" />
                  {action.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent papers">
            {recentPapers.map((paper) => (
              <CommandItem key={paper} onSelect={() => runCommand("/papers")}>
                {paper}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
