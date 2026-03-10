import { ReactNode } from "react";
import QuestionLabel from "../atoms/QuestionLabel";
import RadioButton from "../atoms/RadioButton";

interface ConditionalQuestionProps {
  question: string;
  name: string;
  value: "ja" | "nei" | "";
  onChange: (value: "ja" | "nei") => void;
  children?: ReactNode;
  required?: boolean;
}

export default function ConditionalQuestion({
  question,
  name,
  value,
  onChange,
  children,
  required = false,
}: ConditionalQuestionProps) {
  return (
    <div className="mb-6">
      <QuestionLabel text={question} required={required} />
      <div className="space-y-2 mb-4">
        <RadioButton
          id={`${name}-ja`}
          name={name}
          value="ja"
          label="Ja"
          checked={value === "ja"}
          onChange={(val) => onChange(val as "ja" | "nei")}
        />
        <RadioButton
          id={`${name}-nei`}
          name={name}
          value="nei"
          label="Nei"
          checked={value === "nei"}
          onChange={(val) => onChange(val as "ja" | "nei")}
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
