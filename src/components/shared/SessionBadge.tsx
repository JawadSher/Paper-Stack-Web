import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SessionBadgeProps = {
  session: "annual" | "supplementary" | "model";
};

const sessionStyles = {
  annual: "bg-ps-teal/15 text-ps-teal",
  supplementary: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  model: "bg-ps-purple/15 text-ps-purple",
};

const sessionLabels = {
  annual: "Annual",
  supplementary: "Supplementary",
  model: "Model",
};

export function SessionBadge({ session }: SessionBadgeProps) {
  return (
    <Badge className={cn("border-transparent", sessionStyles[session])}>
      {sessionLabels[session]}
    </Badge>
  );
}
