import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import React from "react";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { format } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
//1. hk sg elastic ip address 2. global accelrator
import {
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import LineSeparator from "@/components/ui/lineSeparator";

const TodoFormMenuStrip = () => {
  const { todoItem: todo, priority, setPriority } = useTodoForm();
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="p-1 border rounded-sm text-sm hover:bg-border hover:text-white">
        <DayMenu />
      </div>
      <MenuContainer>
        <MenuTrigger className="hover:text-white border text-sm">
          <LaurelWreath
            className={clsx(
              "w-5 h-5",
              priority === "Low"
                ? "text-lime"
                : priority === "Medium"
                  ? "text-orange"
                  : "text-red"
            )}
          />
          <p className="hidden sm:block">Priority</p>
        </MenuTrigger>
        <MenuContent className="border-popover-accent">
          <MenuItem onClick={() => setPriority("Low")}>
            <PriorityIndicator level={1} className={clsx("h-5 w-5")} />
            level 1
          </MenuItem>
          <MenuItem onClick={() => setPriority("Medium")}>
            <PriorityIndicator level={2} className={clsx("h-5 w-5")} />
            level 2
          </MenuItem>
          <MenuItem onClick={() => setPriority("High")}>
            <PriorityIndicator level={3} className={clsx("h-5 w-5")} />
            level 3
          </MenuItem>
        </MenuContent>
      </MenuContainer>

      <MenuContainer>
        <MenuTrigger className="border">
          <Repeat className="w-5 h-5" />
          <p className="hidden sm:block text-sm">Repeat</p>
        </MenuTrigger>
        <MenuContent className="border-popover-accent">
          <MenuItem className="">
            daily
          </MenuItem>
          <MenuItem
            className="flex justify-between items-center"
          >
            weekly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "EEE")}
            </p>
          </MenuItem>
          <MenuItem
            className="flex justify-between items-center"
          >
            monthly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "do")}
            </p>
          </MenuItem>
          <LineSeparator className="border-popover-accent w-full mb-1" />
          <MenuItem className="">
            every weekday
            <p className="text-xs text-card-foreground-muted">(Mon-Fri)</p>
          </MenuItem>
          <LineSeparator className="border-popover-accent mb-2" />
          <MenuItem className="">
            custom
            <p className="text-xs text-card-foreground-muted"></p>
          </MenuItem>
        </MenuContent>
      </MenuContainer>
    </div>
  );
};
export default TodoFormMenuStrip;
