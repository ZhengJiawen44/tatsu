import React from "react";
import Pointer from "../ui/icon/pointer";
const Day = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  console.log(currentDate);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDay = days[currentDate.getDay()];
  const currentMMDDYYYY = `${
    months[currentDate.getMonth() + 1]
  } ${currentDate.getUTCDate()}, ${currentDate.getFullYear()}`;
  return (
    <div className="flex justify-center items-center gap-20 mt-24 mb-10">
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
