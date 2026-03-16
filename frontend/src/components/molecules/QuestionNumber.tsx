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
}: QuestionNumberProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} />
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <NumberInput
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            unit={unit}
            onChange={onChange}
          />
        </div>
        {onAnswer && (
          <button
            type="button"
            onClick={onAnswer}
            className="px-4 py-2 bg-brand-navy text-white rounded-md hover:opacity-90 whitespace-nowrap mt-0"
          >
            Lagre svar
          </button>
        )}
      </div>
    </div>
  );
}
