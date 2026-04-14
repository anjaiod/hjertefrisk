interface NumberInputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  unit?: string;
  onChange: (value: string) => void;
}

export default function NumberInput({
  id,
  name,
  value,
  placeholder,
  unit,
  onChange,
}: NumberInputProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-36 md:w-48 px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy touch-manipulation"
      />
      {unit && <span className="text-base md:text-lg text-gray-600">{unit}</span>}
    </div>
  );
}
