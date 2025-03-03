"use client";
import React from "react";
import SidebarContainer from "./newSidebar/SidebarContainer";
import UserCard from "./newSidebar/Account/UserCard";
import VaultItem from "./newSidebar/SidebarItems/VaultItem";
import NoteCollapsible from "./newSidebar/SidebarItems/NoteCollapsible";
import TodoItem from "./newSidebar/SidebarItems/TodoItem";
import CompletedItem from "./newSidebar/SidebarItems/CompletedItem";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen h-screen">
      <SidebarContainer>
        <UserCard className="mb-3" />
        <TodoItem />
        <CompletedItem />
        <NoteCollapsible />
        <VaultItem />
      </SidebarContainer>
      <div className="flex flex-col flex-1 z-0">{children}</div>
    </div>
  );
};

export default AppLayout;
