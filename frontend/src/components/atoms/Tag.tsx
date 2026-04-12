import type { ReactNode } from "react";

export type TagVariant = "high" | "medium" | "low" | "none";

interface TagProps {
  variant?: TagVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<TagVariant, string> = {
  high: "bg-brand-orange-lightest text-brand-orange",
  medium: "bg-brand-sun-lightest text-brand-orange",
  low: "bg-brand-mint-lightest text-brand-sage",
  none: "bg-brand-mist-lightest text-brand-navy",
};

const dotClasses: Record<TagVariant, string> = {
  high: "bg-brand-orange",
  medium: "bg-brand-sun",
  low: "bg-brand-sage",
  none: "bg-brand-navy-lightest",
};

export function Tag({
  variant = "medium",
  children,
  className = "",
}: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-base font-semibold",
        variantClasses[variant],
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
