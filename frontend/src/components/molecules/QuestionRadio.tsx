import QuestionLabel from "../atoms/QuestionLabel";
import RadioButton from "../atoms/RadioButton";

interface Option {
  value: string;
  label: string;
  score?: number;
}

interface QuestionRadioProps {
  question: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onAnswer?: () => void;
  hasFollowUpQuestions?: boolean; // Hvis true, auto-advance kun hvis ikke trigger follow-ups
  followUpTriggerValues?: string[]; // Verdier som trigger follow-up spørsmål
  required?: boolean;
  compact?: boolean;
  smallLabel?: boolean;
  description?: string;
  highlightedIndex?: number | null;
}

export default function QuestionRadio({
  question,
  name,
  options,
  value,
  onChange,
  onAnswer,
  hasFollowUpQuestions = false,
  followUpTriggerValues = [],
  required = false,
  compact = false,
  smallLabel = false,
  description,
  highlightedIndex,
}: QuestionRadioProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Don't auto-advance if this value triggers follow-up questions
    const triggersFollowUp =
      hasFollowUpQuestions && followUpTriggerValues.includes(newValue);
    if (onAnswer && !triggersFollowUp) {
      setTimeout(() => onAnswer(), 500);
    }
  };

  return (
    <div className="mb-6">
      <QuestionLabel
        text={question}
        required={required}
        compact={compact}
        small={smallLabel}
        description={description}
      />
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={option.value}
            className={`
        rounded-lg transition
        ${highlightedIndex === index ? "ring-2 ring-teal-400 bg-teal-50" : ""}
      `}
          >
            <RadioButton
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={option.label}
              checked={value === option.value}
              onChange={handleChange}
              score={option.score}
              compact={compact}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
