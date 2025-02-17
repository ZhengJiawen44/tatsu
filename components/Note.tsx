import React from "react";
import { cn } from "@/lib/utils";
const Note = ({ className }: { className?: string }) => {
  return <div className={cn("", className)}>Note</div>;
};

export default Note;
