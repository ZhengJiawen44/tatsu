"use client";
import React, { useEffect, useState } from "react";
import { MenuContainer, MenuItem } from "@/components/TitleBar";
import Note from "@/components/Note/NoteContainer";
import Vault from "@/components/Vault/VaultContainer";
import Todo from "@/components/Todo/TodoContainer";
import clsx from "clsx";
import Sidebar from "@/components/Sidebar/SidebarContainer";
import NoteProvider from "@/providers/NoteProvider";

const Page = () => {
  const [activeMenu, setActiveMenu] = useState("Todo");
  useEffect(() => {
    const prevTab = localStorage.getItem("prevTab");
    if (prevTab && ["Note", "Todo", "Vault"].includes(prevTab)) {
      setActiveMenu(prevTab);
    }
  }, []);

  return (
    <div className="grid w-full h-[calc(100vh-148px)] grid-cols-3 grid-rows-2   gap-[40px] ">
      <NoteProvider>
        <div className="flex flex-col col-span-2 row-span-2 w-full h-full rounded-2xl bg-card ">
          <MenuContainer className="relative  border-white z-20">
            <MenuItem
              className={
                activeMenu === "Todo"
                  ? "text-accent h-full border-b-2 border-lime"
                  : "h-full border-b-2 border-card-muted"
              }
              onClick={() => {
                setActiveMenu("Todo");
                localStorage.setItem("prevTab", "Todo");
              }}
            >
              Todos
            </MenuItem>
            <MenuItem
              className={
                activeMenu === "Vault"
                  ? "text-accent h-full border-b-2 border-lime"
                  : "h-full border-b-2 border-card-muted"
              }
              onClick={() => {
                setActiveMenu("Vault");
                localStorage.setItem("prevTab", "Vault");
              }}
            >
              Vault
            </MenuItem>
            <MenuItem
              className={
                activeMenu === "Note"
                  ? "text-accent h-full border-b-2 border-lime"
                  : "h-full border-b-2 border-card-muted"
              }
              onClick={() => {
                setActiveMenu("Note");
                localStorage.setItem("prevTab", "Note");
              }}
            >
              Notes
            </MenuItem>
          </MenuContainer>
          <Todo className={clsx(activeMenu !== "Todo" && "hidden")} />
          <Note className={clsx(activeMenu !== "Note" && "hidden")} />
          <Vault className={clsx(activeMenu !== "Vault" && "hidden")} />
        </div>
        <div className="col-span-1 row-span-2 w-full h-full flex flex-col gap-10">
          <Sidebar activeMenu={activeMenu} />
        </div>
      </NoteProvider>
    </div>
  );
};

export default Page;
