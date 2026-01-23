import React from "react";
import { useLocale } from "next-intl";

const Day = () => {
  const locale = useLocale();
  const currentDate = new Date();

  // Format day name
  const dayName = new Intl.DateTimeFormat(locale, {
    weekday: "long"
  }).format(currentDate);

  // Format month and date
  const monthAndDate = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric"
  }).format(currentDate);

  return (
    <div className="flex items-end gap-2 mb-8 sm:mb-16 text-muted-foreground">
      <span className="leading-none text-[1.2rem] sm:text-3xl">
        {dayName},
      </span>
      <span className="text-[1rem] sm:text-2xl">
        {monthAndDate}
      </span>
    </div>
  );
};

export default Day;