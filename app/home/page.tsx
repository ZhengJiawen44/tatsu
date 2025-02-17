"use client";
import React, { useState } from "react";
import { MenuContainer, MenuItem } from "@/components/Menu";
import Note from "@/components/Note";
import Vault from "@/components/Vault";
import Todo from "@/components/Todo";
import clsx from "clsx";
const page = () => {
  const [activeMenu, setActiveMenu] = useState("Todos");

  return (
    <div className="grid w-full h-[calc(100vh-148px)] grid-cols-3 grid-rows-2 gap-[40px]">
      <div className="flex flex-col col-span-2 row-span-2 w-full h-full rounded-2xl bg-card">
        <MenuContainer className="">
          <MenuItem
            className={
              activeMenu === "Todos"
                ? "text-accent h-full border-b-2 border-lime"
                : "h-full border-b-2 border-card-muted"
            }
            onClick={() => setActiveMenu("Todos")}
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
            }}
          >
            Vault
          </MenuItem>
          <MenuItem
            className={
              activeMenu === "Notes"
                ? "text-accent h-full border-b-2 border-lime"
                : "h-full border-b-2 border-card-muted"
            }
            onClick={() => {
              setActiveMenu("Notes");
            }}
          >
            Notes
          </MenuItem>
        </MenuContainer>
        <Todo className={clsx(activeMenu === "Todos" ? "" : "hidden")} />
        <Note className={clsx(activeMenu === "Note" ? "" : "hidden")} />
        <Vault className={clsx(activeMenu === "Vault" ? "" : "hidden")} />
      </div>

      {/* <div className="col-span-1 row-span-1 w-full h-full rounded-3xl bg-card"></div>
      <div className="col-span-1 row-span-1 w-full h-full rounded-3xl bg-card"></div> */}
    </div>
  );
};

export default page;
