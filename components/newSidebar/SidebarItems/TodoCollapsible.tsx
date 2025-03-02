import CaretOutline from "@/components/ui/icon/caretOutline";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { useState } from "react";
import OK from "@/components/ui/icon/ok";
import { useMenu } from "@/providers/MenuProvider";

const TodoCollapsible = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const [open, setOpen] = useState(false);
  return (
    <Collapsible className="w-full" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        onClick={() => {
          setActiveMenu("Todo");
          localStorage.setItem("prevTab", "Todo");
        }}
        className={clsx(
          "flex gap-1 justify-start items-center w-full py-2 px-2 rounded-lg hover:bg-border-muted hover:bg-opacity-85 select-none",
          activeMenu === "Todo" && "bg-border"
        )}
      >
        <CaretOutline
          className={clsx(
            "w-3 h-3 transition-transform duration-300 stroke-card-foreground",
            open && "rotate-90"
          )}
        />
        <OK className="w-5 h-5" />
        todo
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 mt-2 ">
          <div className="pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer">
            completed
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TodoCollapsible;
