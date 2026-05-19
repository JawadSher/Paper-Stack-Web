"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FrequencyBar } from "@/components/shared/FrequencyBar";
import { YearDots } from "@/components/shared/YearDots";
import { slideInLeft, slideInRight } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export type CommonQuestionsTeaserProps = Record<string, never>;

export function CommonQuestionsTeaser({}: CommonQuestionsTeaserProps) {
  const { ref, controls } = useScrollAnimation();

  return (
    <section
      id="common-questions"
      ref={ref}
      className="relative overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute left-[-10%] top-10 size-72 rounded-full bg-ps-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-8%] size-80 rounded-full bg-ps-coral/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={slideInLeft}
          className="relative space-y-5"
        >
          <Badge className="bg-ps-teal/12 text-ps-teal">Common questions</Badge>
          <h2 className="text-3xl font-semibold md:text-4xl">
            Know what&apos;s coming
          </h2>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            PaperStack highlights questions that repeat across years, so you
            can prioritize the topics that matter most before exams.
          </p>
          <Link
            href="/#common-questions"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-ps-teal hover:bg-ps-teal/90",
            )}
          >
            Explore common questions
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={slideInRight}
          className="relative rounded-lg border bg-card p-5 shadow-sm"
          style={{ animation: "ps-float 4s ease-in-out infinite" }}
        >
          <span className="absolute right-4 top-4 size-2.5 rounded-full bg-ps-coral [animation:ps-pulse-dot_1.8s_ease-in-out_infinite]" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Physics - Class 10
              </p>
              <h3 className="mt-2 text-xl font-semibold">
                State Ohm&apos;s law and verify it experimentally.
              </h3>
            </div>
            <Badge className="bg-ps-teal/12 text-ps-teal">
              <BadgeCheck className="size-3.5" />
              Asked in 4 out of 5 years
            </Badge>
          </div>
          <div className="mt-8 space-y-5">
            <FrequencyBar frequency={4} totalYears={5} />
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">Appeared in</p>
              <YearDots yearsAppeared={[2019, 2020, 2022, 2024]} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
