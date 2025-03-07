import React from "react";
import Meatball from "./icon/meatball";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const MeatballMenu = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        <Meatball className="fill-card-foreground hover:fill-white" />
      </PopoverTrigger>
      <PopoverContent
        className="bg-popover min-w-36 flex flex-col gap-1 px-1  w-fit h-fit  text-white border backdrop-blur-sm"
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
  children,
  onClick,
}: {
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
      className="flex justify-start items-center gap-2 hover:cursor-pointer p-1 hover:bg-popover-foreground rounded-md px-2 pr-10"
    >
      {children}
    </div>
  );
};
export { MeatballMenu, MenuItem };
