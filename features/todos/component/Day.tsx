"use client";
import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";

const Day = () => {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //gotta fight ssr for this one
  if (!mounted) {
    return (
      <div className="flex items-end gap-2 mb-8 sm:mb-16 text-muted-foreground">
        <span className="leading-none text-[1.2rem] sm:text-3xl invisible">
          Loading...
        </span>
      </div>
    );
  }

  const currentDate = new Date();

  const dayName = new Intl.DateTimeFormat(locale, {
    weekday: "long"
  }).format(currentDate);

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