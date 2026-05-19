"use client";

import { motion } from "framer-motion";
import { FileText, Grid3X3, ListChecks, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export type HowItWorksSectionProps = Record<string, never>;

const steps = [
  {
    title: "Choose your board and class",
    icon: Grid3X3,
  },
  {
    title: "Find your subject",
    icon: ListChecks,
  },
  {
    title: "View or download the paper",
    icon: FileText,
  },
];

export function HowItWorksSection({}: HowItWorksSectionProps) {
  const { ref, controls } = useScrollAnimation();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden bg-[#1A1917] py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_600px_380px_at_18%_18%,rgba(207,102,121,0.16),transparent_62%),radial-gradient(ellipse_560px_360px_at_82%_86%,rgba(45,184,150,0.12),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[length:30px_30px] opacity-55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge className="mb-5 gap-2 border border-[#2DB896]/30 bg-white/5 text-[#B8F5E7] shadow-[0_0_30px_rgba(45,184,150,0.14)] backdrop-blur">
            <Route className="size-3.5" />
            Study flow
          </Badge>
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/62">
            A simple flow built around how students already study.
          </p>
        </motion.div>
        <div className="relative mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial="hidden"
                animate={controls}
                variants={fadeUp}
                custom={index}
                className="relative"
              >
                <article className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#CF6679]/35 hover:bg-white/[0.085]">
                  <div className="absolute -right-16 -top-16 size-36 rounded-full bg-[#CF6679]/20 blur-3xl transition-opacity group-hover:opacity-80" />
                  <div className="absolute -bottom-20 left-8 size-40 rounded-full bg-[#2DB896]/10 blur-3xl" />
                  <span className="absolute right-5 top-4 text-7xl font-black leading-none text-white/[0.045]">
                    0{index + 1}
                  </span>

                  <div className="relative flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-white text-sm font-bold text-[#1A1917] shadow-[0_0_0_6px_rgba(207,102,121,0.12),0_10px_30px_rgba(0,0,0,0.24)] ring-1 ring-[#CF6679]/45">
                      {index + 1}
                    </span>
                    <div className="grid size-14 place-items-center rounded-2xl bg-[#CF6679]/16 text-[#F28A6C] shadow-inner transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                  </div>
                  <h3 className="relative mt-10 max-w-xs text-2xl font-semibold leading-tight tracking-tight text-white">
                    {step.title}
                  </h3>
                  <div className="relative mt-auto h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#CF6679] to-[#2DB896]" />
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
