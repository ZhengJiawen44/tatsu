import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MenuContainer = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "border flex gap-8 text-[1.1rem] bg-card-muted w-full h-[45px] rounded-tr-3xl rounded-tl-2xl shadow-[0px_7px_7px_-5px_hsl(235,32%,10%)] justify-center items-end",

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const MenuItem = ({
  children,
  className,
  onClick,
  ...props
}: {
  children: any;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <p
      className={cn(
        "pt-4 text-card-foreground-muted hover:text-accent hover:cursor-pointer transition-colors duration-200 px-6",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </p>
  );
};

export { MenuContainer, MenuItem };
