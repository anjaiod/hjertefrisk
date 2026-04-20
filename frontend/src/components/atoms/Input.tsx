import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type InputVariant = "default" | "active" | "error";
type InputAs = "input" | "select" | "textarea";

type Option = {
  value: string;
  label: string;
};

interface BaseProps {
  variant?: InputVariant;
  as?: InputAs;
  className?: string;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
type SelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Option[];
    placeholder?: string;
  };
type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | SelectProps | TextAreaProps;

const variantClasses: Record<InputVariant, string> = {
  default:
    "border-brand-mist-light text-slate-600 placeholder:text-brand-mist hover:border-brand-mist",
  active: "border-brand-navy text-brand-navy placeholder:text-brand-navy/60",
  error:
    "border-brand-orange text-brand-orange placeholder:text-brand-orange/70",
};

export function Input(props: Props) {
  const {
    variant = "default",
    as = "input",
    className = "",
    ...rest
  } = props as Props;

  const baseClassName = [
    "w-full rounded-lg border bg-white px-3 py-2 text-sm leading-normal outline-none transition-colors",
    "focus-visible:border-brand-navy",
    variantClasses[variant],
    className,
  ].join(" ");

  if (as === "select") {
    const { options, placeholder, ...selectProps } = rest as SelectProps;

    return (
      <select
        {...selectProps}
        className={[baseClassName, "cursor-pointer appearance-none pr-8"].join(
          " ",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 13L15 7.5' stroke='%23647A89' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "20px 20px",
        }}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (as === "textarea") {
    return <textarea {...(rest as TextAreaProps)} className={baseClassName} />;
  }

  return <input {...(rest as InputProps)} className={baseClassName} />;
}
