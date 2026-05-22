import Link from "next/link";
import { Check, GraduationCap } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { ClassLevel } from "@/types";

export type ClassSelectorProps = {
  boardId: string;
  classes?: ClassLevel[];
  selectedClass?: ClassLevel;
};

const defaultClasses: ClassLevel[] = [9, 10, 11, 12];

export function ClassSelector({
  boardId,
  classes = defaultClasses,
  selectedClass,
}: ClassSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-lg border p-1.5 shadow-sm sm:grid-cols-4"
      style={
        {
          "--class-accent-soft":
            "color-mix(in oklch, var(--primary) 13%, transparent)",
          "--class-accent-wash":
            "color-mix(in oklch, var(--primary) 8%, var(--card))",
        } as CSSProperties
      }
    >
      {classes.map((classLevel) => {
        const isSelected = selectedClass === classLevel;

        return (
          <Link
            key={classLevel}
            href={`/browse/${boardId}/${classLevel}`}
            aria-current={isSelected ? "page" : undefined}
            className={cn(
              "group relative isolate flex h-16 items-center justify-between overflow-hidden rounded-md border px-4 text-left transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-transparent bg-accent/40 text-foreground  hover:-translate-y-0.5 hover:border-primary/35 hover:bg-(--class-accent-wash)",
            )}
          >
            <span
              className={cn(
                "grid size-10 place-items-center rounded-md transition-colors",
                isSelected
                  ? "bg-white/18 text-primary-foreground"
                  : "bg-(--class-accent-soft) text-primary group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              <GraduationCap className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col px-3">
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-normal",
                  isSelected ? "text-white/75" : "text-muted-foreground",
                )}
              >
                Class
              </span>
              <span className="text-xl font-semibold leading-none">
                {classLevel}
              </span>
            </span>
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border text-[11px] transition-all",
                isSelected
                  ? "border-white/30 bg-white/20 text-primary-foreground"
                  : "border-border text-transparent group-hover:border-primary/35 group-hover:bg-(--class-accent-soft)",
              )}
            >
              <Check className="size-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
