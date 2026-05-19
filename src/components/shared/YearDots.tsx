import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type YearDotsProps = {
  yearsAppeared: number[];
};

const years = [2019, 2020, 2021, 2022, 2023, 2024];

export function YearDots({ yearsAppeared }: YearDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {years.map((year) => {
        const appeared = yearsAppeared.includes(year);

        return (
          <Tooltip key={year}>
            <TooltipTrigger>
              <span
                aria-label={`${year}: ${appeared ? "appeared" : "not appeared"}`}
                className={cn(
                  "block size-3 rounded-full border transition-colors",
                  appeared
                    ? "border-ps-coral bg-ps-coral"
                    : "border-border bg-transparent",
                )}
              />
            </TooltipTrigger>
            <TooltipContent>{year}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
