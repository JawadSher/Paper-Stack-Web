import { Apple, Play } from "lucide-react";

export type AppDownloadSectionProps = Record<string, never>;

export function AppDownloadSection({}: AppDownloadSectionProps) {
  return (
    <section id="download-app" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-ps-coral text-white lg:grid-cols-[1fr_320px]">
          <div className="p-8 sm:p-12">
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
                className="inline-flex h-14 items-center gap-3 rounded-lg bg-black px-5 text-left text-white"
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
                className="inline-flex h-14 items-center gap-3 rounded-lg bg-black px-5 text-left text-white"
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
          <div className="flex items-center justify-center bg-black/10 p-8">
            <div className="grid size-44 place-items-center rounded-xl bg-white p-4">
              <div className="grid size-full grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      index % 2 === 0 || index % 7 === 0
                        ? "rounded-sm bg-black"
                        : "rounded-sm bg-black/10"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
