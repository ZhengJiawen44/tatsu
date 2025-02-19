import React from "react";
import { useState } from "react";
const useDate = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return [currentDate, setCurrentDate];
};

export default useDate;
