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
        "select-none flex items-center py-3 px-3 w-full rounded-lg hover:cursor-pointer hover:bg-popover border border-transparent",
        activeMenu.name === "Calendar" &&
          "bg-popover-accent shadow-md text-form-foreground-accent !border-border",
      )}
      onClick={() => {
        setActiveMenu({ name: "Calendar" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <div className="flex gap-3 justify-start items-center w-full  select-none">
        <Calendar1Icon
          className={clsx(
            "w-5 h-5 stroke-muted-foreground",
            activeMenu.name === "Calendar" && "stroke-form-foreground-accent",
          )}
        />
        Calendar
      </div>
    </Link>
  );
};

export default CalendarItem;
