"use client";

import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { AdminSidebar } from "./AdminSidebar";
import { CommandPalette } from "./CommandPalette";

export type AdminTopBarProps = {
  collapsed: boolean;
};

export function AdminTopBar({ collapsed }: AdminTopBarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button type="button" variant="ghost" size="icon-sm">
                  <Menu className="size-5" />
                  <span className="sr-only">Open admin menu</span>
                </Button>
              }
            />
            <SheetContent
              side="left"
              className="w-[280px] p-0"
              showCloseButton={false}
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Admin navigation</SheetTitle>
              </SheetHeader>
              <AdminSidebar collapsed={false} onCollapsedChange={() => undefined} />
            </SheetContent>
          </Sheet>
          <PaperStackLogo size="sm" showText />
        </div>

        <div className="min-w-0 flex-1">
          <AdminBreadcrumb />
        </div>

        <Button
          type="button"
          variant="outline"
          className="hidden h-9 min-w-48 justify-between text-muted-foreground sm:flex"
          onClick={() => setPaletteOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            <Search className="size-4" />
            Search admin
          </span>
          <kbd className="font-mono text-xs">Ctrl K</kbd>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
        <UserButton />
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <span className="sr-only">
        Sidebar is {collapsed ? "collapsed" : "expanded"}
      </span>
    </>
  );
}
