import { subjects } from "@/constants/subjects";
import type { ClassLevel, Subject } from "@/types";

export type SubjectIconName =
  | "Atom"
  | "FlaskConical"
  | "Calculator"
  | "BookOpen"
  | "Globe"
  | "Monitor"
  | "Languages"
  | "Landmark"
  | "TrendingUp"
  | "BarChart2"
  | "Brain"
  | "Users"
  | "Music"
  | "Palette"
  | "Dumbbell"
  | "Scale";

export type AdminSubject = Subject & {
  classes: ClassLevel[];
  icon: SubjectIconName;
  isCompulsory: boolean;
  displayOrder: number;
  status: "active" | "inactive";
};

const iconBySubject: Record<string, SubjectIconName> = {
  Physics: "Atom",
  Chemistry: "FlaskConical",
  Mathematics: "Calculator",
  English: "Languages",
  Urdu: "BookOpen",
  Islamiat: "Landmark",
  "Pakistan Studies": "Globe",
  Biology: "Brain",
  "Computer Science": "Monitor",
};

const compulsory = new Set(["English", "Urdu", "Islamiat", "Pakistan Studies"]);

const byName = new Map<string, AdminSubject>();

subjects.forEach((subject, index) => {
  const existing = byName.get(subject.name);
  if (existing) {
    existing.classes = [...existing.classes, subject.classLevel];
  } else {
    byName.set(subject.name, {
      ...subject,
      classes: [subject.classLevel],
      icon: iconBySubject[subject.name] ?? "BookOpen",
      isCompulsory: compulsory.has(subject.name),
      displayOrder: index + 1,
      status: "active",
    });
  }
});

export const adminSubjects = Array.from(byName.values());
