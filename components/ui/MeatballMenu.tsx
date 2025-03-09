import React, { SetStateAction } from "react";
import Meatball from "./icon/meatball";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import clsx from "clsx";
const MeatballMenu = ({
  children,
  className,
  contentVisible,
  setContentVisible,
}: {
  children: React.ReactNode;
  className?: string;
  contentVisible: boolean;
  setContentVisible: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Popover open={contentVisible} onOpenChange={setContentVisible}>
      <PopoverTrigger
        className={cn(
          clsx(
            " hover:bg-border rounded-md p-1",
            contentVisible && "bg-border",
            className
          )
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Meatball className="fill-card-foreground hover:fill-white w-[17px] h-[17px]" />
      </PopoverTrigger>
      <PopoverContent
        className=" bg-popover min-w-36 flex flex-col gap-1 p-1 w-fit h-fit  text-white border backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

const MenuItem = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
      className={cn(
        "text-sm flex justify-start items-center gap-2 hover:cursor-pointer p-1 hover:bg-popover-foreground rounded-md px-2 pr-10",
        className
      )}
    >
      {children}
    </div>
  );
};
export { MeatballMenu, MenuItem };
