import React from "react";
import { dayNames, monthNames } from "@/lib/date/dateConstants";
import { format } from "date-fns";
const Day = () => {
  const currentDate = new Date();
  const currentDay = dayNames[currentDate.getDay()];
  const currentMMDDYYYY = `${
    monthNames[currentDate.getMonth()]
  } ${format(currentDate, "dd")}, ${currentDate.getFullYear()}`;
  return (
    <div className="mb-8 sm:mb-16 text-muted-foreground ">
      <span className=" leading-none text-[1.2rem] sm:text-3xl ">
        {currentDay},
      </span>
      <span className="text-[1rem] sm:text-2xl">{currentMMDDYYYY}</span>
    </div>
  );
};

export default Day;
