import React from "react";
import TodoItemMeatballMenu from "./TodoItemMeatballMenu";
import TodoItemSideMenu from "./TodoItemSideMenu";
import { TodoItemType } from "@/types";

const TodoItemMenuContainer = ({
  className,
  todo,
  setDisplayForm,
  setEditInstanceOnly,
  ...props
}: {
  className?: string;
  todo: TodoItemType;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>;
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
      <TodoItemMeatballMenu
        setDisplayForm={setDisplayForm}
        setEditInstanceOnly={setEditInstanceOnly}
        todo={todo}
      />
    </div>
  );
};
export default TodoItemMenuContainer;
