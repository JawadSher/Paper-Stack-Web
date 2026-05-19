import {
  Atom,
  BarChart3,
  BookOpenText,
  Brain,
  Calculator,
  Dna,
  Flag,
  FlaskConical,
  HelpCircle,
  Landmark,
  Languages,
  Microscope,
  Monitor,
  MoonStar,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SubjectIconProps = {
  subjectName: string;
  size?: number;
  className?: string;
};

const subjectIcons: Record<string, LucideIcon> = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  mathematics: Calculator,
  "computer science": Monitor,
  english: Languages,
  urdu: BookOpenText,
  islamiat: MoonStar,
  "pakistan studies": Flag,
  "general science": Microscope,
  economics: Landmark,
  statistics: BarChart3,
  psychology: Brain,
  sociology: Users,
};

export function SubjectIcon({
  subjectName,
  size = 20,
  className,
}: SubjectIconProps) {
  const Icon = subjectIcons[subjectName.toLowerCase()] ?? HelpCircle;

  return <Icon aria-hidden="true" size={size} className={cn(className)} />;
}
