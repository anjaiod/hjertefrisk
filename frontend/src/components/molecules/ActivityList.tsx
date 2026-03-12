type Activity = {
  id: number;
  title: string;
  date: Date;
  location: string;
  organizer: string;
};

export function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Dine aktiviteter</h3>

      {activities.map((a) => (
        <div key={a.id} className="flex justify-between border-b pb-3">
          <span>{a.title}</span>
          <span>{a.location}</span>
          <span>{a.organizer}</span>
        </div>
      ))}
    </div>
  );
}
