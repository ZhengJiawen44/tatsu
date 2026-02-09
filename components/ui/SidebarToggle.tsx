import { cn } from "@/lib/utils";
import { useMenu } from "@/providers/MenuProvider";
import { SidebarIcon } from "lucide-react";
import React from "react";
const SidebarToggle = ({
  className,
}: {
  className?: string;
}) => {
  const { setShowMenu } = useMenu();

  return (
    <button
      className={cn(
        "group overflow-visible p-2.5 rounded-md h-fit cursor-pointer hover:bg-popover-border",
        className,
      )}
      aria-label="Close sidebar"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu((prev) => !prev);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
      }}
    >
      <span className="sr-only">Close sidebar</span>

      <div className="hidden xl:group-hover:block bg-border absolute border p-0.75 rounded-md left-full top-1/2 ml-1 -translate-y-1/2 ">
        ctrl+`
      </div>

      <SidebarIcon className="w-6! h-6!" />
    </button>
  );
};

export default SidebarToggle;
