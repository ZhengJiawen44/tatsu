import { cn } from "@/lib/utils";
import { useMenu } from "@/providers/MenuProvider";
import React, { useState } from "react";
const SidebarToggle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { setShowMenu } = useMenu();
  const [showMacro, setShowMacro] = useState(false);
  return (
    <button
      className={cn(
        " overflow-visible relative p-1 rounded-md h-fit ",
        className,
      )}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu((prev) => !prev);
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu((prev) => !prev);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        setShowMacro(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setShowMacro(false);
      }}
    >
      {showMacro && (
        <div className="bg-border absolute border p-[3px] rounded-md left-full top-1/2 ml-1 -translate-y-1/2">
          ctrl+`
        </div>
      )}
      {children}
    </button>
  );
};

export default SidebarToggle;
