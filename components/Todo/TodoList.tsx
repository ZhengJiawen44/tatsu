import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TodoListLoading from "./TodoListLoading";
import TodoItemMenu from "./TodoItemMenu";
import TodoForm from "./TodoForm";
import LineSeparator from "../ui/lineSeparator";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
}

const TodoList = () => {
  // const [pinnedTodos, setPinnedTodos] = useState([]);

  //get all todos
  const { data: todoList, isLoading } = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await fetch("/api/todo", { method: "GET" });
      const { todos } = await res.json();
      return todos;
    },
  });

  if (isLoading) return <TodoListLoading />;

  const pinnedTodos = todoList.filter((todoItem: TodoItem) => {
    return todoItem.pinned;
  });
  const unpinnedTodos = todoList.filter((todoItem: TodoItem) => {
    return !todoItem.pinned;
  });

  return (
    <>
      {pinnedTodos.map(({ id, title, description, pinned }: TodoItem) => {
        return (
          <TodoItem
            key={id}
            id={id}
            title={title}
            description={description}
            pinned={pinned}
          />
        );
      })}
      <LineSeparator className={pinnedTodos.length <= 0 ? "hidden" : ""} />
      {unpinnedTodos.map(({ id, title, description, pinned }: TodoItem) => {
        return (
          <TodoItem
            key={id}
            id={id}
            title={title}
            description={description}
            pinned={pinned}
          />
        );
      })}
    </>
  );
};

const TodoItem = (todoItem: TodoItem) => {
  const { id, title, description, pinned } = todoItem;
  const [isEdit, setEdit] = useState(false);

  if (isEdit) {
    return (
      <TodoForm
        displayForm={true}
        setDisplayForm={setEdit}
        todo={{ id, title, description }}
      />
    );
  }
  return (
    <>
      <div className="flex justify-between items-center my-10">
        <div className="flex flex-col gap-3">
          <p className="text-card-foreground text-[1.3rem]">{title}</p>
          <p className="text-card-foreground-muted text-[1.1rem]">
            {description}
          </p>
        </div>
        <TodoItemMenu id={id} setDisplayForm={setEdit} pinned={pinned} />
      </div>
    </>
  );
};
export default TodoList;
