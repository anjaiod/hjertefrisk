interface QuestionLabelProps {
  text: string;
  required?: boolean;
  compact?: boolean;
  small?: boolean;
  description?: string;
}

export default function QuestionLabel({
  text,
  required = false,
  compact = false,
  small = false,
  description,
}: QuestionLabelProps) {
  return (
    <div className="mb-4">
      <label
        className={
          compact
            ? "block font-medium text-gray-800 mb-2 text-sm"
            : small
              ? "block font-medium text-gray-800 text-[clamp(1.1rem,2.5vw,1.75rem)] leading-snug"
              : "block font-medium text-gray-800 text-[clamp(1.5rem,3.5vw,2.5rem)] leading-snug"
        }
      >
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="mt-1 text-sm text-gray-500 leading-snug">{description}</p>
      )}
    </div>
  );
}
