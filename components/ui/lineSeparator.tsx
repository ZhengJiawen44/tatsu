import React from "react";
import { cn } from "@/lib/utils";
const LineSeparator = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mt-1 w-full h-1 border-b-[1px]", className)}></div>
  );
};

export default LineSeparator;
