import CaretOutline from "@/components/ui/icon/caretOutline";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { SetStateAction } from "react";
import { useMenu } from "@/providers/MenuProvider";
import OK from "@/components/ui/icon/ok";
import Note from "@/components/ui/icon/note";

interface TodoCollapsibleProps {
  openSection: string | null;
  setOpenSection: React.Dispatch<SetStateAction<string | null>>;
}
const TodoCollapsible = ({
  openSection,
  setOpenSection,
}: TodoCollapsibleProps) => {
  const { activeMenu, setActiveMenu, setShowMobileSidebar } = useMenu();

  const toggleOpen = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  return (
    <Collapsible
      open={openSection === "Todo"}
      onOpenChange={() => toggleOpen("Todo")}
    >
      <CollapsibleTrigger
        className={clsx(
          "hover:text-white",
          activeMenu === "Todo" && "text-white"
        )}
      >
        <div className="flex gap-1 justify-center items-center">
          <CaretOutline
            className={clsx(
              "w-5 h-5 transition-transform duration-300 stroke-card-foreground",
              openSection === "Todo" && "rotate-90"
            )}
          />
          Todo
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-9 border-card-foreground-muted flex flex-col gap-4 mb-3">
        <button
          className="w-fit hover:text-white flex gap-2 justify-center items-center pt-3"
          onClick={() => {
            setActiveMenu("Todo");
            setShowMobileSidebar(false);
            localStorage.setItem("prevTab", "Todo");
          }}
        >
          <Note className="w-5 h-5" />
          todo list
        </button>
        <button
          className="w-fit hover:text-white flex gap-2 justify-center items-center"
          onClick={() => {
            setActiveMenu("CompletedTodo");
            setShowMobileSidebar(false);
          }}
        >
          <OK className="w-5 h-5" />
          completed todo
        </button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TodoCollapsible;
