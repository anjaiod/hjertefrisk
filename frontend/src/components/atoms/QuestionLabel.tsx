interface QuestionLabelProps {
  text: string;
  required?: boolean;
}

export default function QuestionLabel({
  text,
  required = false,
}: QuestionLabelProps) {
  return (
    <label className="block text-2xl font-medium text-gray-800 mb-3">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
