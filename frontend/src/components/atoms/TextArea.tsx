interface TextAreaProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}

export default function TextArea({
  id,
  name,
  value,
  placeholder,
  rows = 3,
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
      className="w-full px-4 py-3 text-base md:text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy"
    />
  );
}
