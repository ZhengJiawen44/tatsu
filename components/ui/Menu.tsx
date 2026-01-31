import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { HTMLAttributes } from "react";
const MenuContainer = ({
  children,
}: // showContent,
// setShowContent,
{
  children: React.ReactNode;
  // showContent?: boolean;
  // setShowContent?: React.Dispatch<SetStateAction<boolean>>;
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
        className,
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
      className={cn(clsx("", showContent && "bg-border", className))}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* <Meatball className="fill-card-foreground hover:fill-white w-[17px] h-[17px]" /> */}
      {children}
    </PopoverTrigger>
  );
};

interface MenuItemType extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}
const MenuItem = ({ className, children, onClick, ...props }: MenuItemType) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
      className={cn(
        "text-sm mx-1 mt-0 flex justify-start items-center gap-2 hover:cursor-pointer py-1.5 hover:bg-accent hover:text-accent-foreground rounded-sm px-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export { MenuContainer, MenuItem, MenuTrigger, MenuContent };
