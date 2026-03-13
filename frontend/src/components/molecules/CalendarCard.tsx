"use client";

import { useState } from "react";

type Activity = {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
};

export function CalendarCard({ activities }: { activities: Activity[] }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDayOfMonth + 6) % 7; // starts on monday

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("no-NO", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // placeholder for activities in calendar
  const activityDate = new Date();
  activityDate.setDate(today.getDate() + 3);

  return (
    <div className="bg-white rounded-xl border border-brand-mist shadow-sm p-4 w-[300px]">
      {/* next/prev month */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="text-brand-navy text-sm hover:bg-brand-mist-lightest rounded px-1"
        >
          ←
        </button>

        <h3 className="text-xl font-bold text-brand-navy capitalize">
          {monthName}
        </h3>

        <button
          onClick={nextMonth}
          className="text-brand-navy text-sm hover:bg-brand-mist-lightest rounded px-1"
        >
          →
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-[11px] text-brand-sage mb-1 text-center">
        {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5 text-xs">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={"empty-" + i} />
        ))}

        {days.map((day) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          // placeholder for activities in calendar
          const hasActivity =
            day === activityDate.getDate() &&
            month === activityDate.getMonth() &&
            year === activityDate.getFullYear();

          return (
            <div
              key={day}
              className={`
              aspect-square flex items-center justify-center cursor-pointer
            `}
            >
              <div
                className={`
                w-8 h-8 flex items-center justify-center rounded-full
                ${isToday ? "bg-brand-mint-lighter text-brand-navy" : ""}
                ${hasActivity ? "bg-brand-sky text-brand-navy" : ""}
              `}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
