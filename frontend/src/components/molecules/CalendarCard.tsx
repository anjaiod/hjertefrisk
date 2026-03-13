"use client";

import { IconButton } from "../atoms/IconButton";
import { useState } from "react";

export function CalendarCard({ activityDate }: { activityDate: Date }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDayOfMonth + 6) % 7;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("no-NO", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-brand-mist shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <IconButton onClick={prevMonth} ariaLabel="Previous month">
          ←
        </IconButton>

        <h3 className="text-xl font-bold text-brand-navy capitalize">
          {monthName}
        </h3>

        <IconButton onClick={nextMonth} ariaLabel="Next month">
          →
        </IconButton>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-brand-sage mb-1 text-center">
        {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-xs">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={"empty-" + i} />
        ))}

        {days.map((day) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const hasActivity =
            day === activityDate.getDate() &&
            month === activityDate.getMonth() &&
            year === activityDate.getFullYear();

          return (
            <div
              key={day}
              className="aspect-square flex items-center justify-center cursor-pointer"
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
