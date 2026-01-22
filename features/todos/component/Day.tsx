import React from "react";
import { dayNames } from "@/lib/date/dateConstants";
import { monthNames } from "@/lib/date/dateConstants";
const Day = () => {
  const currentDate = new Date();
  const currentDay = dayNames[currentDate.getDay()];
  return (
    <div className="mb-8 sm:mb-16 text-muted-foreground ">
      <span className=" leading-none text-[1.2rem] sm:text-3xl ">
        {`${currentDay}, `}
      </span>
      <span className="text-[1rem] sm:text-2xl">
        {`${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`}
      </span>
    </div>
  );
};

export default Day;
