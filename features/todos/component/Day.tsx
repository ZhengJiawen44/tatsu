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
    <div className="mb-16">
      <span className=" leading-none text-[1.8rem] text-foreground">
        {currentDay},
      </span>
      <span className=" text-[1.3rem] ml-4">{currentMMDDYYYY}</span>
    </div>
  );
};

export default Day;
