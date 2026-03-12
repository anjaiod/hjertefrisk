import QuestionLabel from "../atoms/QuestionLabel";
import NumberInput from "../atoms/NumberInput";

interface QuestionNumberProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  required?: boolean;
}

export default function QuestionNumber({
  question,
  name,
  value,
  onChange,
  placeholder,
  unit,
  required = false,
}: QuestionNumberProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} />
      <NumberInput
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        unit={unit}
        onChange={onChange}
      />
    </div>
  );
}
