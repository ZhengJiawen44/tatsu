import React from "react";
import { TodoItem } from "@/components/Todo/TodoItem";
import LineSeparator from "@/components/ui/lineSeparator";
import Ok from "@/components/ui/icon/ok";
import { TodoItemType } from "@/types";

const TodoSidebar = ({ todoList }: { todoList: TodoItemType[] }) => {
  return (
    <div>
      <h2 className="flex gap-2 items-center text-[1.4rem]">
        Finished todos <Ok className="w-7 h-7" />
      </h2>
      <LineSeparator />
      {todoList.map((item) => {
        if (item.completed) {
          return (
            <TodoItem key={item.id} todoItem={item} variant="completed-todos" />
          );
        }
      })}
    </div>
  );
};

export default TodoSidebar;
