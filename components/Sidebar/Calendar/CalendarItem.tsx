import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import { Calendar1Icon } from "lucide-react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
const CalendarItem = () => {
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Link
      href="/app/calendar"
      className={clsx(
        "py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted",
        activeMenu.name === "Calendar" && "bg-border",
      )}
      onClick={() => {
        setActiveMenu({ name: "Calendar" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <div className="flex gap-1 justify-start items-center w-full  select-none">
        <Calendar1Icon className="w-5 h-5 " />
        Calendar
      </div>
    </Link>
  );
};

export default CalendarItem;
