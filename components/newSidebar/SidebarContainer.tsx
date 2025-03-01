"use client";
import React, { useEffect, useRef, useState } from "react";
import UserCard from "./Account/UserCard";
import clsx from "clsx";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import CaretOutline from "../ui/icon/caretOutline";
import OK from "../ui/icon/ok";
import Note from "../ui/icon/note";
import { useMenu } from "@/providers/MenuProvider";

const Sidebar = () => {
  //resizable sidebar states
  const resizeHandleRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("20%"); // Initial width

  const [open, setOpen] = useState(false);

  //active menu tabs
  const { activeMenu, setActiveMenu } = useMenu();

  //resizable sidebar logic
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (isResizing && sidebarRef.current) {
        setSidebarWidth(`${e.clientX}px`);
      }
    }
    function onMouseUp() {
      setIsResizing(false);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      id="sidebar_container"
      ref={sidebarRef}
      className="relative h-full bg-sidebar min-w-[200px] max-w-[400px] p-4 pt-6"
      style={{ width: `${sidebarWidth}` }}
    >
      <div
        id="resize_handle"
        ref={resizeHandleRef}
        className={clsx(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize  hover:bg-gray-600"
        )}
        onMouseDown={() => setIsResizing(true)}
      />
      <UserCard />
      <div className="flex flex-col w-full gap-2 my-6">
        <Collapsible className="w-full" open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger
            onClick={() => {
              setActiveMenu("Todo");
              localStorage.setItem("prevTab", "Todo");
            }}
            className={clsx(
              "flex gap-1 justify-start items-center w-full py-1 px-2 rounded-md hover:bg-border hover:bg-opacity-85",
              activeMenu === "Todo" && "bg-border"
            )}
          >
            <CaretOutline
              className={clsx(
                "w-3 h-3 transition-transform duration-300 stroke-card-foreground",
                open && "rotate-90"
              )}
            />
            <Note className="w-5 h-5" />
            todo
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 my-2">
              <div className="pl-12 py-1 px-2 rounded-md hover:bg-border">
                completed
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div
          className="border py-1 px-6 w-full"
          onClick={() => setActiveMenu("Note")}
        >
          <div className="flex gap-1 justify-start items-center w-full">
            <Note className="w-5 h-5" />
            todo
          </div>
        </div>
        <div
          className="border py-1 px-6 w-full"
          onClick={() => setActiveMenu("Note")}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
