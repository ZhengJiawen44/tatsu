import React from "react";
import TodoItemMeatballMenu from "./TodoItemMeatballMenu";
import TodoItemSideMenu from "./TodoItemSideMenu";
import { TodoItemType } from "@/types";

const TodoItemMenu = ({
  className,
  todo,
  displayForm,
  setDisplayForm,
  ...props
}: {
  className?: string;
  todo: TodoItemType;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
      <TodoItemSideMenu setDisplayForm={setDisplayForm} todo={todo} />
      <TodoItemMeatballMenu setDisplayForm={setDisplayForm} todo={todo} />
    </div>
  );
};
export default TodoItemMenu;
