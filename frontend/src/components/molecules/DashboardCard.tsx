type DashboardCardProps = {
  text: string;
  onClick?: () => void;
};

export function DashboardCard({ text, onClick }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <button
        onClick={onClick}
        className="w-full bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-6 rounded-lg transition"
      >
        {text}
      </button>
    </div>
  );
}
