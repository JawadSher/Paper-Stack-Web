import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("inline-flex items-center", classes.wrapper)}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className={cn("shrink-0", classes.icon)}
      >
        <rect
          x="12"
          y="18"
          width="25"
          height="18"
          rx="3"
          className="fill-ps-coral/35"
        />
        <rect
          x="9"
          y="14"
          width="25"
          height="18"
          rx="3"
          className="fill-ps-coral/65"
        />
        <rect
          x="12"
          y="9"
          width="25"
          height="18"
          rx="3"
          className="origin-center -rotate-6 fill-ps-coral"
        />
      </svg>
      {showText ? (
        <span className={cn("font-semibold text-foreground", classes.text)}>
          PaperStack
        </span>
      ) : null}
    </div>
  );
}
