import { cn } from "@/lib/utils";
import Image from "next/image";

export type PaperStackLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

const sizeClasses = {
  sm: { wrapper: "gap-2", icon: "size-7", text: "text-base" },
  md: { wrapper: "gap-2.5", icon: "size-9", text: "text-xl" },
  lg: { wrapper: "gap-3", icon: "size-12", text: "text-2xl" },
};

export function PaperStackLogo({
  size = "md",
  showText = false,
}: PaperStackLogoProps) {
  const classes = sizeClasses[size];

  const icon = "/icon.png";

  return (
    <div className={cn("inline-flex items-center", classes.wrapper)}>
      <Image
        alt="logo"
        src={icon}
        width={36}
        height={36}
        className={classes.icon}
        priority={true}
      />

      {showText && (
        <span className={cn("font-semibold text-foreground", classes.text)}>
          PaperStack
        </span>
      )}
    </div>
  );
}