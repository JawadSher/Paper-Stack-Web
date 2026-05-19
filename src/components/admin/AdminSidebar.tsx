"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";
import { cn } from "@/lib/utils";
import { adminNavItems } from "./admin-nav";

export type AdminSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  className?: string;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[88px]" : "w-[260px]",
        className,
      )}
    >
      <div
        className={cn(
          "relative border-b",
          collapsed
            ? "flex h-20 flex-col items-center justify-center gap-2 px-2"
            : "flex h-16 items-center justify-between gap-2 px-4",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center",
            collapsed
              ? "grid size-11 place-items-center rounded-2xl bg-transparent"
              : "gap-2",
          )}
        >
          <PaperStackLogo size={collapsed ? "md" : "sm"} showText={!collapsed} />
          {!collapsed ? (
            <Badge className="bg-ps-coral text-white">Admin</Badge>
          ) : null}
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hidden md:inline-flex",
            collapsed &&
              "absolute -right-3 top-1/2 size-7 -translate-y-1/2 rounded-full border bg-sidebar shadow-sm hover:bg-sidebar-accent",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "size-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </Button>
      </div>

      <nav
        className={cn(
          "flex flex-1 flex-col gap-1 py-4",
          collapsed ? "items-center px-3" : "px-3",
        )}
      >
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          const link = (
            <Link
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-ps-coral text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "size-11 justify-center px-0",
                !collapsed && "w-full",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.href}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={item.href}>{link}</div>
          );
        })}
      </nav>

      <div className="border-t p-3">
        {!collapsed ? (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/55 p-3">
            <div className="flex items-center gap-3">
              <UserButton />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Admin account</p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-sidebar px-2.5 py-1.5 text-xs text-muted-foreground">
              <span>PaperStack</span>
              <span className="font-mono">v0.1.0</span>
            </div>
          </div>
        ) : (
          <div className="grid justify-items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-transparent">
              <UserButton />
            </div>
            <span className="rounded-full border border-sidebar-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              v0.1
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
