import React from "react";
import { cn } from "@/lib/utils";
const LineSeparator = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full h-1 border-b-[1px] m-auto ", className)}></div>
  );
};

export default LineSeparator;
