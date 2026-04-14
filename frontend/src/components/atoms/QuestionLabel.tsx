interface QuestionLabelProps {
  text: string;
  required?: boolean;
}

export default function QuestionLabel({
  text,
  required = false,
}: QuestionLabelProps) {
  return (
    <label className="block font-medium text-gray-800 mb-4 text-[clamp(1.5rem,3.5vw,2.5rem)] leading-snug">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
