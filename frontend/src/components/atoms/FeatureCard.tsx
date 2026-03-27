export function FeatureCard({
  icon,
  title,
  description,
  iconBgColor,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="rounded-lg bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full shrink-0 ${iconBgColor}`}>
          <div className="text-3xl">{icon}</div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}