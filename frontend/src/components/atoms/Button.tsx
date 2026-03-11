import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "confirm"
  | "risk"
  | "deactivated"
  | "cancel";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-navy text-white border-brand-navy hover:bg-brand-navy-light cursor-pointer",
  secondary:
    "bg-white text-brand-navy border-2 border-brand-navy hover:bg-brand-navy-lightest cursor-pointer",
  confirm:
    "bg-brand-teal text-white border-brand-teal hover:bg-brand-teal-light cursor-pointer",
  risk: "bg-brand-orange text-white border-brand-orange hover:bg-brand-orange-light cursor-pointer",
  deactivated:
    "bg-brand-mist text-white border-brand-mist cursor-not-allowed hover:bg-brand-mist",
  cancel:
    "bg-white text-brand-sky border-2 border-brand-sky hover:bg-brand-sky-lightest cursor-pointer",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  disabled,
  type = "button",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === "deactivated";

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded-lg border px-5 py-2 text-base font-semibold transition-colors",
        fullWidth ? "w-full" : "w-auto",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
