import QuestionLabel from "../atoms/QuestionLabel";
import TextArea from "../atoms/TextArea";

interface QuestionTextAreaProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onAnswer?: () => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  compact?: boolean;
}

export default function QuestionTextArea({
  question,
  name,
  value,
  onChange,
  onAnswer,
  placeholder,
  rows = 3,
  required = false,
  compact = false,
}: QuestionTextAreaProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} compact={compact} />
      <TextArea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        compact={compact}
        onChange={onChange}
      />
      {onAnswer && (
        <button
          type="button"
          onClick={onAnswer}
          className="mt-3 px-5 py-3 md:px-6 md:py-4 text-base md:text-lg bg-brand-navy text-white rounded-xl hover:opacity-90 touch-manipulation cursor-pointer"
        >
          Lagre svar
        </button>
      )}
    </div>
  );
}
