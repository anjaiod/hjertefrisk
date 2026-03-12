interface QuestionLabelProps {
  text: string;
  required?: boolean;
}

export default function QuestionLabel({
  text,
  required = false,
}: QuestionLabelProps) {
  return (
    <label className="block text-base font-medium text-gray-700 mb-2">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
