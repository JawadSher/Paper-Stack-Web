import { BookOpen, Download, Search, Zap, type LucideIcon } from "lucide-react";

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
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Everything a Pakistani student needs
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-lg border bg-card p-5 transition-colors hover:border-ps-coral/40"
              >
                <div
                  className={`grid size-11 place-items-center rounded-full ${feature.accent}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
