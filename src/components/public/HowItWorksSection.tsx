import { ArrowRight, FileText, Grid3X3, ListChecks } from "lucide-react";

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
  return (
    <section id="how-it-works" className="bg-secondary/45 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">
            A simple flow built around how students already study.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative">
                {index < steps.length - 1 ? (
                  <div className="absolute left-[calc(100%-1.25rem)] top-12 hidden w-10 items-center text-muted-foreground lg:flex">
                    <div className="h-px flex-1 border-t border-dashed" />
                    <ArrowRight className="size-4" />
                  </div>
                ) : null}
                <article className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid size-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                      {index + 1}
                    </span>
                    <div className="grid size-11 place-items-center rounded-lg bg-ps-coral/12 text-ps-coral">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
