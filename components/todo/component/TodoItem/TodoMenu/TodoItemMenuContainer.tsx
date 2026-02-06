import React from "react";
import TodoItemMeatballMenu from "./TodoItemMeatballMenu";
import dynamic from "next/dynamic";
import { TodoItemType } from "@/types";
import InlineMenuLoading from "../../Loading/InlineMenuLoading";
const TodoItemSideMenu = dynamic(() => import("./TodoItemSideMenu"), { ssr: false, loading: () => <InlineMenuLoading /> })

const TodoItemMenuContainer = ({
  className,
  todo,
  setDisplayForm,
  setEditInstanceOnly,
  displayMenu,
  ...props
}: {
  className?: string;
  todo: TodoItemType;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>;
  displayMenu: boolean
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
      {displayMenu &&
        <TodoItemSideMenu setDisplayForm={setDisplayForm} todo={todo} />
      }

      <TodoItemMeatballMenu
        setDisplayForm={setDisplayForm}
        setEditInstanceOnly={setEditInstanceOnly}
        todo={todo}
      />
    </div>
  );
};
export default TodoItemMenuContainer;
