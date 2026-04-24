import QuestionLabel from "../atoms/QuestionLabel";
import NumberInput from "../atoms/NumberInput";

interface QuestionNumberProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onAnswer?: () => void;
  placeholder?: string;
  unit?: string;
  required?: boolean;
  compact?: boolean;
  min?: number;
  max?: number;
}

export default function QuestionNumber({
  question,
  name,
  value,
  onChange,
  placeholder,
  unit,
  required = false,
  compact = false,
  min,
  max,
}: QuestionNumberProps) {
  const numVal = parseFloat(value.replace(",", "."));
  const hasValue = value.trim() !== "" && !isNaN(numVal);
  let error: string | undefined;
  if (hasValue) {
    if (min !== undefined && numVal < min) {
      error = `Verdien må være minst ${min}`;
    } else if (max !== undefined && numVal > max) {
      error = `Verdien kan ikke overstige ${max}`;
    }
  }

  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} compact={compact} />
      <NumberInput
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        unit={unit}
        compact={compact}
        min={min}
        max={max}
        error={error}
        onChange={onChange}
      />
    </div>
  );
}
