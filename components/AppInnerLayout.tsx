import React from "react";
import { cn } from "@/lib/utils";
const AppInnerLayout = ({
  className,
  children,
  inert,
}: {
  className?: string;
  children: React.ReactNode;
  inert?: boolean;
}) => {
  return (
    <div
      inert={inert}
      className={cn(
        "overflow-y-scroll h-full w-full scrollbar-none xl:px-[114px] px-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AppInnerLayout;
