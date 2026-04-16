interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: (value: string) => void;
  score?: number;
  compact?: boolean;
}

export default function RadioButton({
  id,
  name,
  value,
  label,
  checked = false,
  onChange,
  score,
  compact = false,
}: RadioButtonProps) {
  return (
    <label
      htmlFor={id}
      className={[
        "flex items-center w-full cursor-pointer transition-colors duration-150",
        compact
          ? "py-1.5 px-3 rounded-md border text-sm gap-2"
          : "py-3 px-5 rounded-xl border-2 touch-manipulation gap-3",
        checked
          ? "bg-brand-sky-lightest border-brand-sky text-brand-navy font-medium"
          : "bg-white border-gray-200 text-gray-800 hover:bg-slate-50 hover:border-gray-300",
      ].join(" ")}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className={compact ? "accent-brand-navy" : "sr-only"}
      />
      <span className={compact ? "cursor-pointer" : "text-lg cursor-pointer"}>
        {label}
        {score !== undefined && (
          <span className="text-gray-500 text-sm ml-2">({score} poeng)</span>
        )}
      </span>
    </label>
  );
}
