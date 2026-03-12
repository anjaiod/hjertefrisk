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
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
      />
      {unit && <span className="text-sm text-gray-600">{unit}</span>}
    </div>
  );
}
