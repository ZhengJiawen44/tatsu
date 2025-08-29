import React from "react";
import { dayNames, monthNames } from "@/lib/date/dateConstants";
import Dot from "@/components/ui/icon/dot";
const Day = () => {
  const currentDate = new Date();
  const currentDay = dayNames[currentDate.getDay()];
  const currentMMDDYYYY = `${
    monthNames[currentDate.getMonth() + 1]
  } ${currentDate.getUTCDate()}, ${currentDate.getFullYear()}`;
  return (
    <div className="flex justify-start items-center mb-10 gap-2">
      <h1 className=" leading-none text-[2rem] text-white">{currentDay}</h1>
      <Dot className="w-4 h-4" />
      <p className=" text-[1rem]">{currentMMDDYYYY}</p>
    </div>
  );
};

export default Day;
