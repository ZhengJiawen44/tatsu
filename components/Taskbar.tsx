import React from "react";
import { auth } from "@/app/auth";
import Avatar from "./ui/avatar";

const Taskbar = async () => {
  const session = await auth();
  const avatar = session?.user?.image;
  return (
    <div className="flex justify-end pr-4 items-center w-full h-[48px] bg-taskbar">
      <Avatar />
    </div>
  );
};

export default Taskbar;
