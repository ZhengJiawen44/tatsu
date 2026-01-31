import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useMenu } from "@/providers/MenuProvider";
import { Toaster } from "../ui/toaster";
import CalendarItem from "./Calendar/CalendarItem";
import CompletedItem from "./Completed/CompletedItem";
import NoteCollapsible from "./Note/NoteCollapsible";
import MenuSidebarItem from "./Settings/MenuSidebarItem";
import TodoItem from "./Todo/TodoSidebarItem";
import UserCard from "./User/UserCard";
import VaultItem from "./Vault/VaultItem";
import ProjectCollapsible from "./Project/ProjectCollapsible";
import LineSeparator from "../ui/lineSeparator";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SidebarContainer = ({ children }: { children?: React.ReactNode }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { isResizing, setIsResizing, showMenu } = useMenu();
  const [sidebarWidth, setSidebarWidth] = useState(350);

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
          sidebarRef.current!.getBoundingClientRect().left,
        );
      }
    },
    [isResizing],
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
          "flex border-r border-sidebar-border h-full fixed inset-0 xl:relative max-w-full xl:max-w-[500px] flex-shrink-0 bg-sidebar z-20 duration-200",
          !showMenu
            ? "-translate-x-full min-w-0 overflow-hidden transition-all"
            : "min-w-[200px] transition-transform overflow-visible",
        )}
        style={{ width: showMenu ? `min(100vw, ${sidebarWidth}px)` : "0px" }}
        onMouseDown={(e) => {
          if (isResizing) e.preventDefault();
        }}
      >
        <div className="flex flex-col justify-between flex-1 min-w-0 m-0 p-0">
          <div className="px-4 mt-2">
            <UserCard />
          </div>
          <div className="flex flex-col gap-2 overflow-y-scroll h-full  my-2 px-4 text-muted-foreground">
            <TodoItem />
            <CompletedItem />
            <CalendarItem />
            <NoteCollapsible />
            <VaultItem />
            <LineSeparator className="m-0 mt-8" />
            <ProjectCollapsible />

            <Toaster />
          </div>
          <div className="px-4">
            <MenuSidebarItem />
          </div>
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
        "fixed w-screen h-screen bg-black z-10 xl:hidden opacity-50",
        !showMenu && "hidden",
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
        "hidden xl:block w-1 cursor-col-resize hover:bg-border",
        isResizing && "bg-border",
      )}
      onMouseDown={startResizing}
    />
  );
};
