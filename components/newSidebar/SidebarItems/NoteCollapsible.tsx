import CaretOutline from "@/components/ui/icon/caretOutline";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { useState } from "react";
import Note from "@/components/ui/icon/note";
import { useMenu } from "@/providers/MenuProvider";
import PlusCircle from "@/components/ui/icon/plusCircle";

const NoteCollapsible = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const [showPlus, setShowPlus] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Collapsible className="w-full" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        onMouseEnter={() => setShowPlus(true)}
        onMouseLeave={() => setShowPlus(false)}
        onClick={() => {
          setActiveMenu("Note");
          localStorage.setItem("prevTab", "Note");
        }}
        className={clsx(
          "flex gap-1 justify-start items-center w-full py-2 px-2 rounded-lg hover:bg-border-muted hover:bg-opacity-85 select-none",
          activeMenu === "Note" && "bg-border"
        )}
      >
        <CaretOutline
          className={clsx(
            "w-3 h-3 transition-transform duration-300 stroke-card-foreground",
            open && "rotate-90"
          )}
        />
        <Note className="w-5 h-5" />
        Note
        {showPlus && (
          <div
            className="mr-0 ml-auto"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <PlusCircle className="w-5 h-5 stroke-card-foreground hover:stroke-white" />
          </div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 mt-2 ">
          <div className="pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer">
            note 1
          </div>
          <div className="pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer">
            note 2
          </div>
          <div className="pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer">
            note 3
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NoteCollapsible;
