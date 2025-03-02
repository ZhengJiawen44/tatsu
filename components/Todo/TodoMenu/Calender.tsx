import React from "react";
import { dayNames, monthNames } from "@/lib/dateConstants";
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
    <div className="flex justify-start items-center gap-20 mb-4 mt-24">
      <div>
        <h1 className=" text-[3rem]">{currentDay}</h1>
        <p className=" text-[1.1rem]">{currentMMDDYYYY}</p>
      </div>
    </div>
  );
};

export default Day;
