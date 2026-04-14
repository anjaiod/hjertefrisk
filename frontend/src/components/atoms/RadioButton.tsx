interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: (value: string) => void;
}

export default function RadioButton({
  id,
  name,
  value,
  label,
  checked = false,
  onChange,
}: RadioButtonProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center w-full py-3 px-5 rounded-xl border-2 cursor-pointer touch-manipulation transition-colors duration-150 ${
        checked
          ? "bg-brand-sky-lightest border-brand-sky text-brand-navy font-medium"
          : "bg-white border-gray-200 text-gray-800 hover:bg-slate-50 hover:border-gray-300"
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span className="text-[clamp(1.1rem,2.5vw,1.5rem)]">{label}</span>
    </label>
  );
}
