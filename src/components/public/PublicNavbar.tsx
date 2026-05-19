import Link from "next/link";
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
import { ThemeToggle } from "./ThemeToggle";

export type PublicNavbarProps = Record<string, never>;

const navLinks = [
  { label: "Browse", href: "/browse" },
  { label: "Common Questions", href: "/#common-questions" },
  { label: "About", href: "/#how-it-works" },
];

const appStoreHref = "https://play.google.com/store";

export function PublicNavbar({}: PublicNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="PaperStack home">
          <PaperStackLogo showText size="md" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href={appStoreHref}
            className={cn(buttonVariants(), "bg-ps-coral hover:bg-ps-coral/90")}
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
                    "mt-2 bg-ps-coral hover:bg-ps-coral/90",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open App
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
