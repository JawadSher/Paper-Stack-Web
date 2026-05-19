"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminDashboardLinkProps = {
  mobile?: boolean;
};

export function AdminDashboardLink({ mobile = false }: AdminDashboardLinkProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <Link
      href="/dashboard"
      className={cn(
        buttonVariants({
          variant: mobile ? "secondary" : "outline",
          size: mobile ? "lg" : "default",
        }),
        mobile && "w-full justify-center",
      )}
    >
      <LayoutDashboard className="size-4" />
      Dashboard
    </Link>
  );
}
