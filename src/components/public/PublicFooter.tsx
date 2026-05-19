import Link from "next/link";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";

export type PublicFooterProps = Record<string, never>;

const footerLinks = [
  { label: "Browse", href: "/browse" },
  { label: "Common Questions", href: "/#common-questions" },
  { label: "About", href: "/#how-it-works" },
  { label: "Download App", href: "/#download-app" },
];

export function PublicFooter({}: PublicFooterProps) {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <PaperStackLogo showText size="md" />
            <p className="text-sm text-muted-foreground">
              Made for Pakistani students
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PaperStack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
