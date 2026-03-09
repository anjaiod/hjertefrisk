import QuestionLabel from "../atoms/QuestionLabel";
import RadioButton from "../atoms/RadioButton";

interface Option {
  value: string;
  label: string;
}

interface QuestionRadioProps {
  question: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function QuestionRadio({
  question,
  name,
  options,
  value,
  onChange,
  required = false,
}: QuestionRadioProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} />
      <div className="space-y-2">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
