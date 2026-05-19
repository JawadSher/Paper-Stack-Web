"use client";

import { useEffect, useRef, useState } from "react";

export type StatsStripProps = Record<string, never>;

const stats = [
  { value: 1200, suffix: "+", label: "Papers" },
  { value: 26, suffix: "", label: "Boards" },
  { value: 44, suffix: "", label: "Subjects" },
  { value: 5, suffix: "", label: "Years" },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function StatsStrip({}: StatsStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    let frame = 0;
    const totalFrames = 48;
    const tick = () => {
      frame += 1;
      setProgress(Math.min(1, frame / totalFrames));
      if (frame < totalFrames) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [hasAnimated]);

  return (
    <section ref={ref} className="border-y bg-ps-surface dark:bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 text-center">
            <p className="text-3xl font-semibold text-foreground md:text-4xl">
              {formatNumber(Math.round(stat.value * progress))}
              {hasAnimated ? stat.suffix : ""}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
