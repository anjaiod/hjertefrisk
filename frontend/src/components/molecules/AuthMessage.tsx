type AuthMessageProps = {
  message: string;
  tone: "error" | "success";
};

const toneClasses = {
  error: "bg-red-50 text-red-700",
  success: "bg-green-50 text-green-700",
};

export function AuthMessage({ message, tone }: AuthMessageProps) {
  return (
    <p className={`rounded-md px-3 py-2 text-sm ${toneClasses[tone]}`}>
      {message}
    </p>
  );
}
