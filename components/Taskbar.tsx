import React from "react";
import Avatar from "./ui/avatar";

const Taskbar = async () => {
  return (
    <div className="justify-end pr-4 items-center w-full h-[48px] bg-taskbar hidden xl:flex">
      <Avatar />
    </div>
  );
};

export default Taskbar;
