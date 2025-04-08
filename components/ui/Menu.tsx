import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { SetStateAction } from "react";
const MenuContainer = ({
  children,
  showContent,
  setShowContent,
}: {
  children: React.ReactNode;
  showContent?: boolean;
  setShowContent?: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return <Popover>{children}</Popover>;
};

const MenuContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <PopoverContent
      className={cn(
        "bg-popover min-w-40 flex flex-col p-0 py-1 w-fit h-fit  text-card-foreground border backdrop-blur-sm text-sm",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </PopoverContent>
  );
};

const MenuTrigger = ({
  showContent,
  className,
  children,
}: {
  showContent?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <PopoverTrigger
      className={cn(
        clsx(
          "flex justify-center items-center gap-2 hover:bg-border rounded-md p-1 hover:text-white",
          showContent && "bg-border",
          className
        )
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* <Meatball className="fill-card-foreground hover:fill-white w-[17px] h-[17px]" /> */}
      {children}
    </PopoverTrigger>
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
        "text-sm mx-1 mt-0 flex justify-start items-center gap-2 hover:cursor-pointer py-1.5 hover:bg-popover-foreground rounded-sm px-2",
        className
      )}
    >
      {children}
    </div>
  );
};
export { MenuContainer, MenuItem, MenuTrigger, MenuContent };
