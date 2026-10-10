import { cn } from "@/lib/utils";
import { useMenu } from "@/providers/MenuProvider";
import { SidebarIcon } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
const SidebarToggle = ({ className }: { className?: string }) => {
  const { setShowMenu } = useMenu();

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Close sidebar"
        className={cn(
          "group overflow-visible p-2.5 rounded-md h-fit cursor-pointer hover:bg-popover-border",
          className,
        )}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowMenu((prev) => !prev);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
        }}
      >
        <SidebarIcon className="w-5! h-5s!" />
      </TooltipTrigger>
      <TooltipContent side="right">ctrl+`</TooltipContent>
    </Tooltip>
  );
};

export default SidebarToggle;
