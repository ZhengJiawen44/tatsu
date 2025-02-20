import React from "react";
import { TodoItem } from "@/components/Todo/TodoItem";
import LineSeparator from "@/components/ui/lineSeparator";
import Note from "@/components/ui/icon/note";

interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  createdAt: Date;
  completed: boolean;
}

const NoteSidebar = ({ todoList }: { todoList: TodoItemType[] }) => {
  return (
    <div>
      <h2 className="flex gap-2 items-center text-[1.4rem]">
        Notes <Note className="w-7 h-7" />
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

export default NoteSidebar;
