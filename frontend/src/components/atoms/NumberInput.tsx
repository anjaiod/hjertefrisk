interface NumberInputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  unit?: string;
  compact?: boolean;
  min?: number;
  max?: number;
  error?: string;
  onChange: (value: string) => void;
}

export default function NumberInput({
  id,
  name,
  value,
  placeholder,
  unit,
  compact,
  min,
  max,
  error,
  onChange,
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <input
          type="number"
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          step="any"
          onChange={(e) => onChange(e.target.value)}
          className={
            compact
              ? `w-24 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy touch-manipulation ${error ? "border-red-500" : "border-gray-300"}`
              : `w-36 md:w-48 px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy touch-manipulation ${error ? "border-red-500" : "border-gray-300"}`
          }
        />
        {unit && (
          <span
            className={
              compact
                ? "text-sm text-gray-600"
                : "text-base md:text-lg text-gray-600"
            }
          >
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p
          className={compact ? "text-xs text-red-600" : "text-sm text-red-600"}
        >
          {error}
        </p>
      )}
    </div>
  );
}
