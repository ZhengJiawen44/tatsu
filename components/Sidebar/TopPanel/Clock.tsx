import React, { useEffect, useState } from "react";

const TopPanel = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    // Update immediately
    updateClock();

    // Calculate ms until next minute
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // Initial timeout to sync with minute changes
    const initialTimeout = setTimeout(() => {
      updateClock();
      // Then set up the interval for subsequent updates
      const interval = setInterval(updateClock, 60000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <>
      <h1 className="text-[6rem] font-bold font-mono text-lime w-full h-fit my`-10 text-center rounded-3xl bg-card">
        {time}
      </h1>
    </>
  );
};

export default TopPanel;
