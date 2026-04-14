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
      className="flex items-center gap-3 py-3 px-4 rounded-xl border border-transparent hover:bg-slate-50 cursor-pointer touch-manipulation -mx-4"
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 md:w-7 md:h-7 text-brand-navy cursor-pointer shrink-0"
      />
      <span className="text-[clamp(1.1rem,2.5vw,1.5rem)]">{label}</span>
    </label>
  );
}
