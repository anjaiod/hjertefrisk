import { ReactNode } from "react";
import QuestionLabel from "../atoms/QuestionLabel";
import RadioButton from "../atoms/RadioButton";

interface ConditionalQuestionProps {
  question: string;
  name: string;
  value: "ja" | "nei" | "";
  onChange: (value: "ja" | "nei") => void;
  onAnswer?: () => void;
  children?: ReactNode;
  hasFollowUpQuestions?: boolean; // Hvis true, auto-advance kun på "nei"
  required?: boolean;
  compact?: boolean;
}

export default function ConditionalQuestion({
  question,
  name,
  value,
  onChange,
  onAnswer,
  children,
  hasFollowUpQuestions = false,
  required = false,
  compact = false,
}: ConditionalQuestionProps) {
  const handleChange = (newValue: "ja" | "nei") => {
    onChange(newValue);
    // Only auto-advance if:
    // - Answer is "nei", OR
    // - Answer is "ja" but there are no children to show AND no follow-up questions
    const shouldAutoAdvance =
      newValue === "nei" || (!children && !hasFollowUpQuestions);
    if (onAnswer && shouldAutoAdvance) {
      setTimeout(() => onAnswer(), 500);
    }
  };

  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} compact={compact} />
      <div className="space-y-2 mb-4">
        <RadioButton
          id={`${name}-ja`}
          name={name}
          value="ja"
          label="Ja"
          checked={value === "ja"}
          onChange={(val) => handleChange(val as "ja" | "nei")}
          compact={compact}
        />
        <RadioButton
          id={`${name}-nei`}
          name={name}
          value="nei"
          label="Nei"
          checked={value === "nei"}
          onChange={(val) => handleChange(val as "ja" | "nei")}
          compact={compact}
        />
      </div>
      {value === "ja" && children && (
        <div className="ml-6 mt-4 border-l-2 border-brand-sky pl-4">
          {children}
        </div>
      )}
    </div>
  );
}
