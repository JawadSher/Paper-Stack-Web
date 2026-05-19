import { Apple, Play } from "lucide-react";

export type AppDownloadSectionProps = Record<string, never>;

function QrPlaceholder() {
  const dots = [
    [8, 8],
    [12, 8],
    [24, 8],
    [32, 8],
    [40, 8],
    [52, 8],
    [60, 8],
    [68, 8],
    [8, 16],
    [28, 16],
    [36, 16],
    [48, 16],
    [68, 16],
    [16, 24],
    [24, 24],
    [44, 24],
    [56, 24],
    [64, 24],
    [8, 32],
    [20, 32],
    [32, 32],
    [40, 32],
    [52, 32],
    [68, 32],
    [12, 40],
    [28, 40],
    [36, 40],
    [48, 40],
    [60, 40],
    [8, 52],
    [20, 52],
    [32, 52],
    [44, 52],
    [56, 52],
    [68, 52],
    [8, 60],
    [28, 60],
    [40, 60],
    [52, 60],
    [64, 60],
    [16, 68],
    [24, 68],
    [36, 68],
    [48, 68],
    [60, 68],
  ];

  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden="true">
      <rect width="120" height="120" rx="14" fill="white" />
      {[
        [12, 12],
        [78, 12],
        [12, 78],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width="30"
            height="30"
            rx="5"
            fill="none"
            stroke="#CF6679"
            strokeWidth="6"
          />
          <rect x={x + 10} y={y + 10} width="10" height="10" rx="2" fill="#1A1917" />
        </g>
      ))}
      {dots.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x + 22}
          y={y + 22}
          width="5"
          height="5"
          rx="1.25"
          fill="#1A1917"
          opacity="0.86"
        />
      ))}
    </svg>
  );
}

export function AppDownloadSection({}: AppDownloadSectionProps) {
  return (
    <section
      id="download-app"
      className="relative overflow-hidden bg-[#1A1917] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_420px_at_50%_20%,rgba(207,102,121,0.13),transparent_62%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#D97757] via-[#C96442] to-[#B4552D] text-white shadow-[0_30px_100px_rgba(0,0,0,0.38)] lg:grid-cols-[1fr_360px]">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="pointer-events-none absolute size-2 rounded-full bg-white/25"
              style={{
                left: `${8 + index * 12}%`,
                top: `${18 + (index % 4) * 18}%`,
                animation: `ps-particle-float ${5 + index * 0.6}s ease-in-out infinite`,
                animationDelay: `${index * 0.25}s`,
              }}
            />
          ))}
          <div className="relative p-8 sm:p-12 lg:p-14">
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Take your papers everywhere
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">
              Download the PaperStack app for offline access
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-xl bg-black px-5 text-left text-white shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
              >
                <Play className="size-6" />
                <span>
                  <span className="block text-xs text-white/70">Get it on</span>
                  <span className="block font-semibold">Google Play</span>
                </span>
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-xl bg-black px-5 text-left text-white shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
              >
                <Apple className="size-6" />
                <span>
                  <span className="block text-xs text-white/70">
                    Download on the
                  </span>
                  <span className="block font-semibold">App Store</span>
                </span>
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center bg-black/12 p-8 lg:p-12">
            <div className="absolute inset-y-0 left-0 hidden w-px bg-white/10 lg:block" />
            <div className="size-48 rotate-2 rounded-[1.5rem] bg-white p-5 shadow-2xl ring-1 ring-white/50 transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]">
              <QrPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
