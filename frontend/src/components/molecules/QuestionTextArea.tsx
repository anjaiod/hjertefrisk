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
}: QuestionTextAreaProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} />
      <TextArea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
      />
      {onAnswer && (
        <button
          type="button"
          onClick={onAnswer}
          className="mt-3 px-4 py-2 bg-brand-navy text-white rounded-md hover:opacity-90"
        >
          Lagre svar
        </button>
      )}
    </div>
  );
}
