import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import { Calendar1Icon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import SidebarItem from "../SidebarItem";
const CalendarItem = () => {
  const sidebarDict = useTranslations("sidebar");
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
      <SidebarItem asChild className={activeMenu.name === "Calendar" ? "bg-sidebar-primary":""}>
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
      </SidebarItem>

  );
};

export default CalendarItem;
