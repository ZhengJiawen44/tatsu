import React from "react";
import Meatball from "./ui/icon/meatball";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const MeatballMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Meatball />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 px-1  w-fit h-fit bg-popover text-white border backdrop-blur-sm">
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
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-start items-center gap-2 hover:cursor-pointer p-1 hover:bg-card-foreground-muted rounded-xl px-2 pr-10"
    >
      {children}
    </div>
  );
};
export { MeatballMenu, MenuItem };
