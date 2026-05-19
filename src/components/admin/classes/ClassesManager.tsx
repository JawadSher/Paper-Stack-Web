"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";
import type { ClassLevel } from "@/types";

const classLevels: ClassLevel[] = [9, 10, 11, 12];

export function ClassesManager() {
  const [inactiveClasses, setInactiveClasses] = useState<ClassLevel[]>([]);
  const [disabledSubjects, setDisabledSubjects] = useState<Record<string, boolean>>({});

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {classLevels.map((classLevel) => {
        const classSubjects = subjects.filter((subject) => subject.classLevel === classLevel);
        const isActive = !inactiveClasses.includes(classLevel);
        return (
          <article key={classLevel} className="rounded-lg border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Class level</p>
                <h2 className="text-5xl font-semibold">{classLevel}</h2>
              </div>
              <Button
                type="button"
                variant={isActive ? "default" : "outline"}
                onClick={() =>
                  setInactiveClasses((items) =>
                    items.includes(classLevel) ? items.filter((item) => item !== classLevel) : [...items, classLevel],
                  )
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Subjects" value={classSubjects.length} />
              <Metric label="Boards" value={boards.filter((board) => board.classes.includes(classLevel)).length} />
              <Metric label="Papers" value={mockPapers.filter((paper) => paper.classLevel === classLevel).length} />
            </div>
            <div className="mt-5 space-y-2">
              {classSubjects.map((subject) => {
                const key = `${classLevel}-${subject.id}`;
                const enabled = !disabledSubjects[key];
                return (
                  <div key={subject.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      onClick={() => setDisabledSubjects((state) => ({ ...state, [key]: enabled }))}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                );
              })}
            </div>
            <Link href={`/subjects?class=${classLevel}`} className="mt-5 inline-flex text-sm font-medium text-ps-coral">
              Edit subjects for this class
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary p-3">
      <p className="text-2xl font-semibold">{value}</p>
      <Badge variant="secondary" className="mt-2">{label}</Badge>
    </div>
  );
}
