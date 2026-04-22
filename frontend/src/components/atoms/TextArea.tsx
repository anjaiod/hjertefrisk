interface TextAreaProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  compact?: boolean;
  onChange: (value: string) => void;
}

export default function TextArea({
  id,
  name,
  value,
  placeholder,
  rows = 3,
  compact = false,
  onChange,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={
        compact
          ? "w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
          : "w-full px-4 py-3 text-base md:text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy"
      }
    />
  );
}
