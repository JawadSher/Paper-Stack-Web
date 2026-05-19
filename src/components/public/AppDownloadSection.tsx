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
    <section id="download-app" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid overflow-hidden rounded-2xl bg-ps-coral text-white shadow-xl lg:grid-cols-[1fr_320px]">
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
          <div className="relative p-8 sm:p-12">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Take your papers everywhere
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/85">
              Download the PaperStack app for offline access
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-lg bg-black px-5 text-left text-white shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
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
                className="inline-flex h-14 items-center gap-3 rounded-lg bg-black px-5 text-left text-white shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
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
          <div className="relative flex items-center justify-center bg-black/10 p-8">
            <div className="size-44 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-white/50">
              <QrPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
