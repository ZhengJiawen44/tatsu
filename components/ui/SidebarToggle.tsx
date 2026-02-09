import { cn } from "@/lib/utils";
import { useMenu } from "@/providers/MenuProvider";
import { SidebarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
const SidebarToggle = ({
  className,
  isSecondary
}: {
  className?: string;
  isSecondary?: boolean
}) => {
  const { setShowMenu, showMenu } = useMenu();
  const [showMacro, setShowMacro] = useState(false);
  const [showButton, setShowButton] = useState(false);


  //delay icon to avoid misclicks on mobile
  useEffect(() => {
    if (showMenu == true && !isSecondary) {
      setTimeout(() => setShowButton(true), 250);
    } else if (!showMenu && isSecondary) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }

  }, [isSecondary, showMenu])

  if (!showButton) return null;

  return (
    <button
      className={cn(
        "overflow-visible p-2.5 rounded-md h-fit cursor-pointer hover:bg-popover-border",
        className,
      )}
      aria-label="Close sidebar"
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
      <span className="sr-only">Close sidebar</span>
      {showMacro && (
        <div className="bg-border absolute border p-0.75 rounded-md left-full top-1/2 ml-1 -translate-y-1/2 ">
          ctrl+`
        </div>
      )}
      <SidebarIcon className="w-6! h-6!" />
    </button>
  );
};

export default SidebarToggle;
