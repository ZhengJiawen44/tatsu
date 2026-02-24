import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import { Calendar1Icon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
const CalendarItem = () => {
  const sidebarDict = useTranslations("sidebar")
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center justify-center border border-transparent font-normal px-2!",
        activeMenu.name === "Calendar" &&
        "bg-sidebar-primary",
      )}
    >
      <Link
        href="/app/calendar"
        onClick={() => {
          setActiveMenu({ name: "Calendar" });
          if (width <= 1266) setShowMenu(false);
        }}
      >
        <div className="flex gap-2 items-center w-full  select-none">
          <Calendar1Icon
            className={clsx(
              "w-4.5 h-4.5 stroke-muted-foreground",
              activeMenu.name === "Calendar" && "stroke-form-foreground-accent",
            )}
          />
          <p className="text-foreground">{sidebarDict("calendar")}</p>
        </div>
      </Link>
    </Button>
  );
};

export default CalendarItem;
