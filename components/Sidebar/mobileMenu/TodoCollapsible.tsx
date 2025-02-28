import Caret from "@/components/ui/icon/caret";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { SetStateAction } from "react";
import { useMenu } from "@/providers/MenuProvider";

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
      className=" text-[1.3rem]"
    >
      <CollapsibleTrigger
        className={clsx(
          "hover:text-white",
          activeMenu === "Todo" && "text-white"
        )}
      >
        <div className="flex gap-1 justify-center items-center">
          <Caret
            className={clsx(
              "w-5 h-5 transition-transform duration-300",
              openSection === "Todo" ? "rotate-0" : "-rotate-90"
            )}
          />
          Todo
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-7 border-card-foreground-muted flex flex-col gap-2 my-2">
        <button
          className="w-fit hover:text-white"
          onClick={() => {
            setActiveMenu("Todo");
            setShowMobileSidebar(false);
            localStorage.setItem("prevTab", "Todo");
          }}
        >
          todo list
        </button>
        <button className="w-fit hover:text-white">completed todo</button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TodoCollapsible;
