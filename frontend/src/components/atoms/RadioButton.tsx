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
    <div className="flex items-center gap-2">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 text-brand-navy cursor-pointer"
      />
      <label htmlFor={id} className="text-lg cursor-pointer">
        {label}
      </label>
    </div>
  );
}
