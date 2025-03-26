import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useMenu } from "@/providers/MenuProvider";

const SidebarContainer = ({ children }: { children: React.ReactNode }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { isResizing, setIsResizing, showMenu } = useMenu();
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const startResizing = React.useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
            sidebarRef.current!.getBoundingClientRect().left
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <Overlay />

      <nav
        id="sidebar_container"
        ref={sidebarRef}
        className={clsx(
          "h-full fixed inset-0  md:relative flex flex-row max-w-[500px] flex-shrink-0 bg-sidebar border-r z-20 justify-between duration-200",
          !showMenu
            ? "-translate-x-full  min-w-0 overflow-hidden transition-all"
            : "min-w-[200px] transition-transform overflow-visible"
        )}
        style={{ width: showMenu ? `${sidebarWidth}px` : "0px" }}
        onMouseDown={(e) => {
          if (isResizing) e.preventDefault();
        }}
      >
        <div className="flex flex-col flex-1 pl-2 min-w-0 gap-2 m-0 p-0">
          {children}
        </div>
      </nav>
      <ResizeHandle isResizing={isResizing} startResizing={startResizing} />
    </>
  );
};

export default SidebarContainer;

const Overlay = () => {
  const { showMenu, setShowMenu } = useMenu();
  return (
    <div
      className={clsx(
        "fixed w-screen h-screen bg-black z-10 md:hidden opacity-50",
        !showMenu && "hidden"
      )}
      onClick={() => setShowMenu(false)}
    />
  );
};

const ResizeHandle = ({
  isResizing,
  startResizing,
}: {
  isResizing: boolean;
  startResizing: () => void;
}) => {
  return (
    <div
      className={clsx(
        "hidden md:block w-1 cursor-col-resize hover:bg-border",
        isResizing && "bg-border"
      )}
      onMouseDown={startResizing}
    />
  );
};
