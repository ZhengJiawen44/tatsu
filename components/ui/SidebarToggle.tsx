import { cn } from "@/lib/utils";
import { useMenu } from "@/providers/MenuProvider";
import React from "react";
const SidebarToggle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { setShowMenu } = useMenu();
  return (
    <button
      className={cn("hover:bg-border p-1 rounded-md h-fit", className)}
      onClick={(e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
      }}
    >
      {children}
    </button>
  );
};

export default SidebarToggle;
