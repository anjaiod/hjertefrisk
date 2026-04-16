import type { ReactNode } from "react";

export type TagVariant = "high" | "medium" | "low" | "none";

interface TagProps {
  variant?: TagVariant;
  children: ReactNode;
  className?: string;
  showBorder?: boolean;
}

const variantClasses: Record<TagVariant, string> = {
  high: "bg-brand-red-light text-brand-red",
  medium: "bg-brand-sun-background text-brand-sun-text",
  low: "bg-brand-mint-background text-brand-mint-text",
  none: "bg-brand-mist-background text-brand-mist-text",
};

const borderClasses: Record<TagVariant, string> = {
  high: "border border-risk-high",
  medium: "border border-risk-medium",
  low: "border border-risk-low",
  none: "",
};

const dotClasses: Record<TagVariant, string> = {
  high: "bg-brand-red",
  medium: "bg-brand-sun-text",
  low: "bg-brand-mint-text",
  none: "bg-brand-mist-text",
};

export function Tag({
  variant = "medium",
  children,
  className = "",
  showBorder = false,
}: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-base font-semibold",
        variantClasses[variant],
        showBorder ? borderClasses[variant] : "",
        className,
      ].join(" ")}
    >
      <span
        className={["h-3 w-3 rounded-full", dotClasses[variant]].join(" ")}
      />
      <span>{children}</span>
    </span>
  );
}
