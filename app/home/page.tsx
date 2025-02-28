"use client";
import React from "react";
import { MenuContainer, MenuItem } from "@/components/TitleBar";
import Note from "@/components/Note/NoteContainer";
import Vault from "@/components/Vault/VaultContainer";
import Todo from "@/components/Todo/TodoContainer";
import clsx from "clsx";
import Sidebar from "@/components/Sidebar/SidebarContainer";
import NoteProvider from "@/providers/NoteProvider";
import PassKeyProvider from "@/providers/PassKeyProvider";
import MobileMenuContainer from "@/components/Sidebar/mobileMenu/MobileMenuContainer";
import { useMenu } from "@/providers/MenuProvider";
import CompletedTodoContainer from "@/components/CompletedTodos/CompletedTodoContainer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Page = () => {
  const isXLScreen = useMediaQuery("(min-width: 1280px)");
  const isMobileScreen = !isXLScreen;
  const { activeMenu, setActiveMenu, showMobileSideBar } = useMenu();
  return (
    <div className="xl:grid w-full  xl:h-[calc(100vh-148px)] grid-cols-3 grid-rows-2 gap-[40px]">
      <PassKeyProvider>
        <NoteProvider>
          {isMobileScreen && <MobileMenuContainer />}
          <div className="flex flex-col col-span-2 row-span-2 w-full h-screen xl:h-full xl:rounded-2xl bg-card p-10 xl:p-0">
            <MenuContainer className="hidden relative border-white z-20 xl:show">
              <MenuItem
                className={
                  activeMenu === "Todo"
                    ? "text-accent h-full xl: xl:border-b-2 border-lime"
                    : "h-full  xl:border-b-2 border-card-muted"
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
                    ? "text-accent h-full  xl:border-b-2 border-lime"
                    : "h-full  xl:border-b-2 border-card-muted"
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
                    ? "text-accent h-full  xl:border-b-2 border-lime"
                    : "h-full  xl:border-b-2 border-card-muted"
                }
                onClick={() => {
                  setActiveMenu("Note");
                  localStorage.setItem("prevTab", "Note");
                }}
              >
                Notes
              </MenuItem>
            </MenuContainer>

            {/* contents to display based on the activeMenu */}
            <CompletedTodoContainer
              className={clsx(activeMenu !== "CompletedTodo" && "hidden")}
              inert={showMobileSideBar}
            />
            <Todo
              className={clsx(activeMenu !== "Todo" && "hidden")}
              inert={showMobileSideBar}
            />
            <Note
              className={clsx(activeMenu !== "Note" && "hidden")}
              inert={showMobileSideBar}
            />
            <Vault
              className={clsx(activeMenu !== "Vault" && "hidden")}
              inert={showMobileSideBar}
            />
          </div>

          {/* sidebar content */}

          {isXLScreen && (
            <div
              className={clsx(
                "col-span-1 row-span-2 w-full h-full flex-col gap-10 hidden xl:flex"
              )}
            >
              <Sidebar />
            </div>
          )}
        </NoteProvider>
      </PassKeyProvider>
    </div>
  );
};

export default Page;
