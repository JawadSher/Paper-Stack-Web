import Link from "next/link";
import { BookOpen, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";
import { cn } from "@/lib/utils";

export type HeroSectionProps = Record<string, never>;

const trustBadges = ["26+ Boards", "5 Years of Papers", "Free Forever"];

export function HeroSection({}: HeroSectionProps) {
  return (
    <section className="min-h-[80vh] overflow-hidden">
      <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge className="bg-ps-coral/12 text-ps-coral">
              Pakistan board papers
            </Badge>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] text-foreground md:text-7xl">
              Every past paper. One place.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Access 5 years of past papers from all Pakistan boards. Browse
              free, download offline in the app.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/browse"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-ps-coral px-5 hover:bg-ps-coral/90",
              )}
            >
              <BookOpen className="size-5" />
              Browse Papers
            </Link>
            <Link
              href="#download-app"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 px-5",
              )}
            >
              <Download className="size-5" />
              Download App
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-4xl border bg-card px-3 py-1 text-sm font-medium text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="absolute -inset-8 rounded-full bg-ps-teal/10 blur-3xl" />
          <div className="relative mx-auto h-[620px] w-[310px] rounded-[2.4rem] border-[10px] border-foreground bg-foreground p-2 shadow-2xl">
            <div className="h-full overflow-hidden rounded-[1.75rem] bg-background">
              <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-foreground" />
              <div className="space-y-5 p-5">
                <PaperStackLogo showText size="sm" />
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Today
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Physics past papers
                  </p>
                </div>
                <div className="grid gap-3">
                  {["FBISE", "BISE Lahore", "BISE Karachi"].map((board) => (
                    <div
                      key={board}
                      className="flex items-center gap-3 rounded-xl border bg-card p-3"
                    >
                      <div className="grid size-10 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{board}</p>
                        <p className="text-xs text-muted-foreground">
                          Class 10 • Annual 2024
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-ps-coral/40 bg-ps-coral/10 p-5 text-center">
                  <div className="mx-auto grid size-20 place-items-center rounded-xl bg-card">
                    <PaperStackLogo size="lg" />
                  </div>
                  <p className="mt-3 text-sm font-medium">Offline library</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
