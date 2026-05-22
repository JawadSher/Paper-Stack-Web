"use client";

import { useEffect, useRef, useState } from "react";

export type StatsStripProps = Record<string, never>;

const stats = [
  { value: 1200, suffix: "+", label: "Papers" },
  { value: 35, suffix: "", label: "Boards" },
  { value: 44, suffix: "", label: "Subjects" },
  { value: 5, suffix: "", label: "Years" },
];

function easeOutExpo(value: number) {
  return value === 1 ? 1 : 1 - 2 ** (-10 * value);
}

function CountUp({
  value,
  suffix,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  active: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    let startTime: number | null = null;
    let animationFrame = 0;
    const duration = 1800;
    const timeout = window.setTimeout(() => {
      const tick = (time: number) => {
        startTime ??= time;
        const progress = Math.min(1, (time - startTime) / duration);
        setCount(Math.round(value * easeOutExpo(progress)));
        frame += 1;
        if (progress < 1 && frame < 180) animationFrame = window.requestAnimationFrame(tick);
      };
      animationFrame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [active, delay, value]);

  return (
    <>
      {new Intl.NumberFormat("en-US").format(count)}
      {active ? suffix : ""}
    </>
  );
}

export function StatsStrip({}: StatsStripProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="border-y border-border/40"
      style={{
        background:
          "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(207,102,121,0.04) 0%, transparent 70%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative px-4 py-4 text-center md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-border/40"
          >
            <p className="text-5xl font-bold text-foreground">
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                active={active}
                delay={index * 150}
              />
            </p>
            <p className="mt-3 text-sm uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
