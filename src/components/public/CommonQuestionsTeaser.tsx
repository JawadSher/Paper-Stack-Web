import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FrequencyBar } from "@/components/shared/FrequencyBar";
import { YearDots } from "@/components/shared/YearDots";
import { cn } from "@/lib/utils";

export type CommonQuestionsTeaserProps = Record<string, never>;

export function CommonQuestionsTeaser({}: CommonQuestionsTeaserProps) {
  return (
    <section id="common-questions" className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-5">
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
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Physics • Class 10</p>
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
        </div>
      </div>
    </section>
  );
}
