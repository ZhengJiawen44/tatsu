import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import { Calendar1Icon } from "lucide-react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import { Button } from "@/components/ui/button";
const CalendarItem = () => {
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center border border-transparent ",
        activeMenu.name === "Calendar" &&
          "bg-sidebar-primary shadow-md text-form-foreground-accent !border-border",
      )}
    >
      <Link
        href="/app/calendar"
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
    </Button>
  );
};

export default CalendarItem;
