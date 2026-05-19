import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClassLevel } from "@/types";

export type ClassSelectorProps = {
  boardId: string;
  selectedClass?: ClassLevel;
};

const classes: ClassLevel[] = [9, 10, 11, 12];

export function ClassSelector({ boardId, selectedClass }: ClassSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {classes.map((classLevel) => (
        <Link
          key={classLevel}
          href={`/browse/${boardId}/${classLevel}`}
          className={cn(
            buttonVariants({
              size: "lg",
              variant: selectedClass === classLevel ? "default" : "outline",
            }),
            "h-16 text-lg",
          )}
        >
          Class {classLevel}
        </Link>
      ))}
    </div>
  );
}
