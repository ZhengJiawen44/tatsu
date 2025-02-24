import React from "react";
import TodoSidebar from "./TodoSidebar/TodoSidebarContainer";
import NoteSidebar from "./NoteSidebar/NoteSidebarContainer";
import VaultSidebar from "./VaultSidebar/VaultSidebarContainer";
import { useTodo } from "@/hooks/useTodo";
import { useNote } from "@/hooks/useNote";
const BottomPanel = ({ activeMenu }: { activeMenu: string }) => {
  // query todo data
  const { todos } = useTodo();
  // query note data
  const { notes } = useNote();

  return (
    <>
      <div className="h-full rounded-3xl bg-card p-16 overflow-y-scroll scrollbar-none">
        {activeMenu === "Todo" && <TodoSidebar todoList={todos} />}
        {activeMenu === "Vault" && <VaultSidebar />}
        {activeMenu === "Note" && <NoteSidebar noteList={notes} />}
      </div>
    </>
  );
};

export default BottomPanel;
