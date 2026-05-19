"use client";

import { motion } from "framer-motion";
import { BookOpen, Download, Search, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { scaleIn, fadeUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export type FeaturesSectionProps = Record<string, never>;

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    icon: BookOpen,
    title: "All Pakistan boards",
    description:
      "FBISE, all BISE boards from Punjab, Sindh, KPK, Balochistan, AJK and GB",
    accent: "bg-ps-coral/12 text-ps-coral",
  },
  {
    icon: Download,
    title: "Offline access",
    description: "Download papers and study without internet",
    accent: "bg-ps-teal/12 text-ps-teal",
  },
  {
    icon: Zap,
    title: "Common questions",
    description: "See which questions appear every year across past papers",
    accent: "bg-ps-purple/12 text-ps-purple",
  },
  {
    icon: Search,
    title: "Smart search",
    description: "Filter by board, class, subject and year instantly",
    accent: "bg-ps-coral/12 text-ps-coral",
  },
];

export function FeaturesSection({}: FeaturesSectionProps) {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="features" ref={ref} className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <Badge className="bg-ps-coral/12 text-ps-coral">Features</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Everything a{" "}
            <span className="bg-gradient-to-r from-[#CF6679] to-[#2DB896] bg-clip-text text-transparent">
              Pakistani student
            </span>{" "}
            needs
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial="hidden"
                animate={controls}
                variants={scaleIn}
                custom={index}
                className="ps-hover-border-sweep group relative overflow-hidden rounded-lg border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#CF6679]/40 hover:bg-[#FAF9F7]/70 hover:shadow-md dark:hover:bg-white/5"
              >
                <span className="pointer-events-none absolute right-4 top-3 text-5xl font-black leading-none text-muted-foreground/20">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className={`grid size-12 place-items-center rounded-xl shadow-inner transition-transform duration-300 group-hover:scale-110 ${feature.accent}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
