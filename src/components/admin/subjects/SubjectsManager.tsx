"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SubjectsTable } from "@/components/admin/subjects/SubjectsTable";
import { adminSubjects } from "@/constants/admin-subjects";
import { cn } from "@/lib/utils";

const tabs = ["All", "Class 9", "Class 10", "Class 11", "Class 12"] as const;

export function SubjectsManager() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const filtered = useMemo(() => {
    if (tab === "All") return adminSubjects;
    const classLevel = Number(tab.replace("Class ", ""));
    return adminSubjects.filter((subject) => subject.classes.includes(classLevel as 9 | 10 | 11 | 12));
  }, [tab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <Button key={item} type="button" size="sm" variant={tab === item ? "default" : "outline"} onClick={() => setTab(item)}>
              {item}
            </Button>
          ))}
        </div>
        <Link href="/subjects/new" className={cn(buttonVariants({ size: "sm" }), "bg-ps-coral hover:bg-ps-coral/90")}>
          <Plus className="size-4" />
          Add subject
        </Link>
      </div>
      <SubjectsTable subjects={filtered} />
    </div>
  );
}
