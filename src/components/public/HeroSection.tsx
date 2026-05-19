"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  Home,
  Search,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";
import { cn } from "@/lib/utils";

export type HeroSectionProps = Record<string, never>;

const headlineLines = [
  { text: "Every past paper.", accent: false },
  { text: "One place.", accent: true },
];

const trustBadges = [
  { label: "26+ Boards", color: "bg-[#CF6679]" },
  { label: "5 Years of Papers", color: "bg-[#2DB896]" },
  { label: "Free Forever", color: "bg-[#7C6FF7]" },
];

const paperCards = [
  {
    subject: "Physics",
    board: "FBISE",
    year: "2024",
    session: "Annual",
    sessionClass: "bg-[#2DB896]/12 text-[#2DB896]",
    progress: false,
  },
  {
    subject: "Chemistry",
    board: "BISE Lahore",
    year: "2023",
    session: "Annual",
    sessionClass: "bg-[#2DB896]/12 text-[#2DB896]",
    progress: false,
  },
  {
    subject: "Maths",
    board: "BISE Karachi",
    year: "2024",
    session: "Supplementary",
    sessionClass: "bg-amber-500/12 text-amber-600",
    progress: true,
  },
];

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

const phoneEntrance = {
  hidden: { opacity: 0, x: 60, rotateY: 8 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.7,
      delay: 0.2,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

function ProgressDownloadIcon() {
  return (
    <span className="relative grid size-8 place-items-center rounded-full bg-[#CF6679]/12 text-[#CF6679]">
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 size-8 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
          strokeDasharray="88"
          className="[animation:ps-download-ring_2.4s_ease-in-out_infinite]"
        />
      </svg>
      <Download className="size-3.5" />
    </span>
  );
}

export function HeroSection({}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const shouldAnimate = mounted && !reducedMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1A1917] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 500px at -10% 20%, rgba(207,102,121,0.12) 0%, transparent 60%), radial-gradient(ellipse 500px 400px at 110% 80%, rgba(45,184,150,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:28px_28px] opacity-60" />

      <AnimatePresence mode="wait">
        <div
          key={mounted ? "animated" : "static"}
          className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[55fr_45fr] lg:px-8"
        >
          <div className="space-y-8">
            <div className="space-y-5">
              <motion.div
                initial={shouldAnimate ? "hidden" : false}
                animate="visible"
                variants={fadeIn}
                className="[will-change:transform]"
              >
                <Badge className="gap-2 border border-[#CF6679]/30 bg-[#CF6679]/10 text-[#F5C1CB] shadow-[0_0_24px_rgba(207,102,121,0.16)]">
                  <span className="size-1.5 rounded-full bg-[#CF6679] [animation:ps-pulse-dot_1.8s_ease-in-out_infinite]" />
                  Pakistan board papers
                </Badge>
              </motion.div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
                {headlineLines.map((line, index) => (
                  <span
                    key={line.text}
                    className={cn(
                      "block overflow-hidden",
                      line.accent && "text-[#CF6679]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block whitespace-nowrap",
                        shouldAnimate && "ps-typewriter-line",
                      )}
                      style={
                        {
                          "--ps-type-chars": line.text.length,
                          "--ps-type-delay": `${index * 0.95}s`,
                        } as CSSProperties
                      }
                    >
                      {line.text}
                    </span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={shouldAnimate ? "hidden" : false}
                animate="visible"
                variants={fadeUp}
                custom={0.35}
                className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl [will-change:transform]"
              >
                Access 5 years of past papers from all Pakistan boards. Browse
                free, download offline in the app.
              </motion.p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.div
                initial={shouldAnimate ? "hidden" : false}
                animate="visible"
                variants={fadeUp}
                custom={0.45}
                className="[will-change:transform]"
              >
                <Link
                  href="/browse"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "ps-shimmer group h-11 bg-[#CF6679] px-5 text-white hover:bg-[#CF6679]/90",
                  )}
                >
                  <BookOpen className="size-5" />
                  Browse Papers
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                initial={shouldAnimate ? "hidden" : false}
                animate="visible"
                variants={fadeUp}
                custom={0.5}
                className="[will-change:transform]"
              >
                <Link
                  href="#download-app"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-11 border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Download className="size-5" />
                  Download App
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {trustBadges.map((badge, index) => (
                <motion.span
                  key={badge.label}
                  initial={shouldAnimate ? "hidden" : false}
                  animate="visible"
                  variants={fadeIn}
                  custom={0.55 + index * 0.1}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-white/72 backdrop-blur-sm [will-change:transform]"
                >
                  <span className={cn("size-1.5 rounded-full", badge.color)} />
                  <CheckCircle2 className="size-3.5 text-white/55" />
                  {badge.label}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            initial={shouldAnimate ? "hidden" : false}
            animate="visible"
            variants={phoneEntrance}
            className="relative mx-auto hidden w-full max-w-[400px] [perspective:1400px] [will-change:transform] sm:block"
          >
            <div className="absolute -inset-8 rounded-full bg-[#2DB896]/10 blur-3xl" />
            <div className="relative mx-auto w-[326px] [animation:ps-float_6s_ease-in-out_infinite]">
              <div className="absolute -left-1 top-28 h-14 w-1 rounded-l-full bg-[#3A3835]/85" />
              <div className="absolute -left-1 top-48 h-20 w-1 rounded-l-full bg-[#3A3835]/85" />
              <div className="absolute -right-1 top-40 h-24 w-1 rounded-r-full bg-[#3A3835]/85" />
              <div className="mx-auto h-[652px] w-[326px] rounded-[3rem] bg-gradient-to-br from-[#4A4845] via-[#1C1C1E] to-[#090909] p-[3px] shadow-[0_34px_90px_rgba(0,0,0,0.52)] ring-1 ring-white/12">
                <div className="h-full rounded-[2.8rem] bg-[#0B0B0D] p-3">
                  <div className="h-full overflow-hidden rounded-[2.35rem] bg-[#FAF9F7] text-[#1A1917] shadow-[inset_0_0_22px_rgba(0,0,0,0.08)]">
                    <div className="relative flex h-full flex-col">
                      <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-[#111113] shadow-[inset_0_1px_2px_rgba(255,255,255,0.14)]" />

                      <div className="space-y-4 px-4 pb-4 pt-14">
                        <div className="flex items-center justify-between">
                          <PaperStackLogo showText size="sm" />
                          <span className="size-2.5 rounded-full bg-[#CF6679] shadow-[0_0_14px_rgba(207,102,121,0.7)] [animation:ps-pulse-dot_1.8s_ease-in-out_infinite]" />
                        </div>

                        <motion.div
                          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.75, duration: 0.45 }}
                          className="flex h-12 items-center gap-2 rounded-2xl bg-[#F1EFE8] px-3 text-sm text-[#6B6860]"
                        >
                          <Search className="size-4" />
                          <span className="relative">
                            Search papers...
                            <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-[#6B6860]/70 [animation:ps-type-caret_0.9s_steps(1)_infinite]" />
                          </span>
                        </motion.div>

                        <div className="flex gap-2 overflow-hidden">
                          {["Physics", "Chemistry", "Mathematics"].map(
                            (chip, index) => (
                              <motion.span
                                key={chip}
                                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.08 }}
                                className={cn(
                                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-sm",
                                  index === 0
                                    ? "bg-[#CF6679] text-white shadow-[#CF6679]/25"
                                    : "bg-white text-[#6B6860] shadow-sm",
                                )}
                              >
                                {chip}
                              </motion.span>
                            ),
                          )}
                        </div>

                        <div className="space-y-3">
                          {paperCards.map((paper, index) => (
                            <motion.div
                              key={`${paper.subject}-${paper.year}`}
                              initial={shouldAnimate ? "hidden" : false}
                              animate="visible"
                              variants={fadeUp}
                              custom={0.8 + index * 0.12}
                              className="rounded-2xl border border-[#E8E6E0] bg-white p-3 shadow-[0_8px_18px_rgba(26,25,23,0.08)] transition-transform duration-300 hover:-translate-y-1 [will-change:transform]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold">
                                    {paper.subject}
                                  </p>
                                  <p className="mt-1 text-xs text-[#6B6860]">
                                    {paper.board} | {paper.year}
                                  </p>
                                </div>
                                {paper.progress ? (
                                  <ProgressDownloadIcon />
                                ) : (
                                  <span className="grid size-8 place-items-center rounded-full bg-[#CF6679]/12 text-[#CF6679]">
                                    <Download className="size-4" />
                                  </span>
                                )}
                              </div>
                              <span
                                className={cn(
                                  "mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                  paper.sessionClass,
                                )}
                              >
                                {paper.session}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-4 border-t border-[#E8E6E0] bg-white px-3 pb-5 pt-2 text-[10px] font-medium text-[#6B6860]">
                        <span className="grid justify-items-center gap-1 text-[#CF6679]">
                          <Home className="size-4" />
                          Home
                        </span>
                        <span className="grid justify-items-center gap-1">
                          <Search className="size-4" />
                          Search
                        </span>
                        <span className="relative grid justify-items-center gap-1">
                          <span className="absolute right-4 top-0 grid size-4 place-items-center rounded-full bg-[#CF6679] text-[9px] text-white [animation:ps-badge-pop_1.7s_ease-in-out_infinite]">
                            3
                          </span>
                          <Download className="size-4" />
                          Downloads
                        </span>
                        <span className="grid justify-items-center gap-1">
                          <User className="size-4" />
                          Profile
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-[#1C1C1E]/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ChevronDown className="absolute bottom-6 left-1/2 size-6 -translate-x-1/2 text-white/45 [animation:ps-scroll-cue_3s_ease-in-out_forwards]" />
    </section>
  );
}
