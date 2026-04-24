export function FeatureCard({
  icon,
  title,
  description,
  iconBgColor,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg bg-white p-4 shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer flex flex-col justify-center ${className ?? ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${iconBgColor}`}
        >
          <div className="text-2xl">{icon}</div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
