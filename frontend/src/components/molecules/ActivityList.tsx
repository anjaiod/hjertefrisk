type Activity = {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
};

export function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl border border-brand-mist shadow-sm">
      <div className="px-4 py-3 border-b border-brand-mist">
        <h3 className="text-lg font-semibold text-brand-navy">
          Dine aktiviteter
        </h3>
      </div>

      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-brand-mist-lightest font-medium text-sm px-4 py-2 border-b border-brand-mist">
        <span>Hva</span>
        <span>Når</span>
        <span>Hvor</span>
        <span>Hvem</span>
      </div>

      {activities.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 border-b border-brand-mist text-sm"
        >
          <span>{a.title}</span>
          <span>{a.date}</span>
          <span>{a.location}</span>
          <span>{a.organizer}</span>
        </div>
      ))}
    </div>
  );
}
