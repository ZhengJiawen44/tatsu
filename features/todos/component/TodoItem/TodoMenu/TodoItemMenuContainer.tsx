import React from "react";
import TodoItemMeatballMenu from "./TodoItemMeatballMenu";
import TodoItemSideMenu from "./TodoItemSideMenu";

const TodoItemMenu = ({ className, ...props }: { className?: string }) => {
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
