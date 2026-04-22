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
  onAnswer,
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
      <div className="flex gap-3 items-start">
        <div className="flex-1">
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
        {onAnswer && (
          <button
            type="button"
            onClick={onAnswer}
            className="px-5 py-3 md:px-6 md:py-4 text-base md:text-lg bg-brand-navy text-white rounded-xl hover:opacity-90 whitespace-nowrap touch-manipulation"
          >
            Lagre svar
          </button>
        )}
      </div>
    </div>
  );
}
