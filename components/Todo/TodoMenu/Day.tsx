import React from "react";
import { dayNames, monthNames } from "@/lib/dateConstants";
import Dot from "@/components/ui/icon/dot";
const Day = ({
  currentDate,
}: {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const currentDay = dayNames[currentDate.getDay()];
  const currentMMDDYYYY = `${
    monthNames[currentDate.getMonth() + 1]
  } ${currentDate.getUTCDate()}, ${currentDate.getFullYear()}`;
  return (
    <div className="flex justify-start items-center mb-4 gap-2">
      <h1 className=" leading-none text-[2rem]">{currentDay}</h1>
      <Dot className="w-4 h-4" />
      <p className=" text-[1rem]">{currentMMDDYYYY}</p>
    </div>
  );
};

export default Day;
