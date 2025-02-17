import React from "react";
import Avatar from "./ui/avatar";

const Taskbar = async () => {
  return (
    <div className="flex justify-end pr-4 items-center w-full h-[48px] bg-taskbar">
      <Avatar />
    </div>
  );
};

export default Taskbar;
