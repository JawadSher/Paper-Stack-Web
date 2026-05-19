"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Grid3X3, ListChecks } from "lucide-react";
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
    <section id="how-it-works" ref={ref} className="bg-secondary/35 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">
            A simple flow built around how students already study.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
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
                {index < steps.length - 1 ? (
                  <div className="absolute left-[calc(100%-1.25rem)] top-12 hidden w-10 items-center text-muted-foreground lg:flex">
                    <ArrowRight className="size-4" />
                  </div>
                ) : null}
                <article className="rounded-lg border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ps-coral/35 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <span className="grid size-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background ring-2 ring-ps-coral/25 ring-offset-4 ring-offset-background">
                      {index + 1}
                    </span>
                    <div className="grid size-11 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
