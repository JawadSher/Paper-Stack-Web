"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";
import { cn } from "@/lib/utils";
import { AdminDashboardLink } from "./AdminDashboardLink";
import { ThemeToggle } from "./ThemeToggle";

export type PublicNavbarProps = Record<string, never>;

const navLinks = [
  { label: "Browse", href: "/browse" },
  { label: "Common Questions", href: "/#common-questions" },
  { label: "About", href: "/#how-it-works" },
];

const appStoreHref = "https://play.google.com/store";

export function PublicNavbar({}: PublicNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-all duration-300",
        scrolled
          ? "border-border/50 bg-background/80 shadow-sm backdrop-blur-md"
          : "bg-background/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="PaperStack home"
          className="transition-transform duration-200 ease-out hover:scale-[1.02]"
        >
          <PaperStackLogo showText size="md" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const baseHref = link.href.split("#")[0];
            const isActive =
              baseHref === "/"
                ? pathname === "/"
                : pathname === baseHref || pathname.startsWith(`${baseHref}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative pb-1 text-sm font-medium text-muted-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ps-coral after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100",
                  isActive &&
                    "text-foreground before:absolute before:-bottom-1.5 before:left-1/2 before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-ps-coral",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <AdminDashboardLink />
          <Link
            href={appStoreHref}
            className={cn(
              buttonVariants(),
              "ps-shimmer bg-ps-coral hover:bg-ps-coral/90",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Open App
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button type="button" variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[86vw]">
              <SheetHeader>
                <SheetTitle>
                  <PaperStackLogo showText size="sm" />
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={appStoreHref}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "ps-shimmer mt-2 bg-ps-coral hover:bg-ps-coral/90",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open App
                </Link>
                <AdminDashboardLink mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
