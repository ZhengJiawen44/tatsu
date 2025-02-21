import React from "react";
import { dayNames, monthNames } from "@/lib/dateConstants";
const Day = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const currentDay = dayNames[currentDate.getDay()];
  const currentMMDDYYYY = `${
    monthNames[currentDate.getMonth() + 1]
  } ${currentDate.getUTCDate()}, ${currentDate.getFullYear()}`;
  return (
    <div className="flex justify-center items-center gap-20 mb-4 mt-24">
      {/* <Pointer
        variant="left"
        onClick={() =>
          setCurrentDate(
            new Date(currentDate.setDate(currentDate.getDate() - 1))
          )
        }
      /> */}
      <div>
        <h1 className="text-center text-[3rem]">{currentDay}</h1>
        <p className="text-center text-[1.1rem]">{currentMMDDYYYY}</p>
      </div>
      {/* <Pointer
        onClick={() =>
          setCurrentDate(
            new Date(currentDate.setDate(currentDate.getDate() + 1))
          )
        }
      /> */}
    </div>
  );
};

export default Day;
