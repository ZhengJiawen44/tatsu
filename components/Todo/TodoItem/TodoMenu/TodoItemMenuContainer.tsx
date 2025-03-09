import React from "react";
import TodoItemMeatballMenu from "./TodoItemMeatballMenu";
import TodoItemSideMenu from "./TodoItemSideMenu";
import { useTodoMenu } from "@/providers/TodoMenuProvider";

const TodoItemMenu = ({ className, ...props }: { className?: string }) => {
  const { id, setDisplayForm, pinned } = useTodoMenu();
  return (
    <div
      className={className}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      {...props}
    >
      <TodoItemSideMenu />
      <TodoItemMeatballMenu />
    </div>
  );
};
export default TodoItemMenu;
