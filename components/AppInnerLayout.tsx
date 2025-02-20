import React from "react";
import { cn } from "@/lib/utils";
const AppInnerLayout = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "overflow-y-scroll h-full w-full scrollbar-none px-[114px] pt-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AppInnerLayout;
