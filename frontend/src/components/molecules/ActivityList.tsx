type Activity = {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
};

export function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Dine aktiviteter
      </h3>

      <div className="flex flex-col gap-4">
        {activities.map((a) => (
          <div key={a.id} className="flex justify-between border-b pb-3">
            <div>
              <p className="font-medium text-slate-900">{a.title}</p>
              <p className="text-sm text-slate-500">{a.date}</p>
            </div>

            <div className="text-sm text-slate-500">{a.location}</div>

            <div className="text-sm text-slate-500">{a.organizer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
