import type { ChangeEvent } from "react";
import { Input } from "@/components/atoms/Input";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
};

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  minLength,
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        className="text-slate-900"
      />
    </div>
  );
}
