import { Badge } from "@/components/ui/badge";
import { FrequencyBar } from "@/components/shared/FrequencyBar";
import { YearDots } from "@/components/shared/YearDots";

export type QuestionPreviewCardProps = {
  text: string;
  chapter: string;
  yearsAppeared: number[];
};

export function QuestionPreviewCard({ text, chapter, yearsAppeared }: QuestionPreviewCardProps) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <Badge variant="secondary">{chapter || "Chapter tag"}</Badge>
      <p className="mt-4 text-sm leading-6">{text || "Question preview will appear here."}</p>
      <div className="mt-5 space-y-4">
        <FrequencyBar frequency={yearsAppeared.length} totalYears={6} />
        <YearDots yearsAppeared={yearsAppeared} />
      </div>
    </article>
  );
}
