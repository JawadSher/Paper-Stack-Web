"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

export type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>
      <div
        className="flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-200 md:pl-[260px] data-[collapsed=true]:md:pl-[88px]"
        data-collapsed={collapsed}
      >
        <AdminTopBar collapsed={collapsed} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
