import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";

export type PublicFooterProps = Record<string, never>;

const footerLinks = [
  { label: "Browse", href: "/browse" },
  { label: "Common Questions", href: "/#common-questions" },
  { label: "About", href: "/#how-it-works" },
  { label: "Download App", href: "/#download-app" },
];

const resourceLinks = [
  { label: "Boards", href: "/browse" },
  { label: "Search", href: "/search" },
  { label: "Past Papers", href: "/browse" },
  { label: "Admin", href: "/dashboard" },
];

export function PublicFooter({}: PublicFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#1A1917] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_760px_420px_at_12%_12%,rgba(207,102,121,0.16),transparent_62%),radial-gradient(ellipse_640px_420px_at_88%_72%,rgba(45,184,150,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:30px_30px] opacity-45" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/45">
              Experience better studying
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
              Every paper,
              <span className="block bg-gradient-to-r from-[#CF6679] via-[#F28A6C] to-[#2DB896] bg-clip-text text-transparent">
                always close.
              </span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:pt-10">
            <nav className="space-y-3" aria-label="Footer navigation">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                Explore
              </p>
              {footerLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-lg font-medium text-white/72 transition-colors hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>

            <nav className="space-y-3" aria-label="Footer resources">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                Resources
              </p>
              {resourceLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-lg font-medium text-white/72 transition-colors hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-16 flex w-full justify-start overflow-hidden">
          <p className="select-none whitespace-nowrap text-left text-[18vw] font-black leading-[0.82] tracking-[-0.025em] text-white/[0.055] sm:text-[15vw] lg:text-[11.8rem]">
            PaperStack
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <PaperStackLogo showText size="md" textClassName="text-white" />
            <p className="text-sm text-white/55">Made for Pakistani students</p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-white/45 md:items-end">
            <p>© 2026 PaperStack. All rights reserved.</p>
            <p>Built for boards, classes, subjects, and serious exam prep.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
