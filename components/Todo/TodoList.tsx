import React from "react";
import { useQuery } from "@tanstack/react-query";
import TodoListLoading from "./TodoListLoading";
import LineSeparator from "../ui/lineSeparator";
import { TodoItem } from "./TodoItem";
import { getDisplayDate } from "@/lib/displayDate";

interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  createdAt: Date;
  completed: boolean;
}

// Helper function to group todos by their display date
const groupTodosByDate = (todos: TodoItemType[]) => {
  return todos.reduce((groups: Record<string, TodoItemType[]>, todo) => {
    const dateKey = getDisplayDate(todo.createdAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(todo);
    return groups;
  }, {});
};

const TodoList = () => {
  const { data: todoList = [], isLoading } = useQuery<TodoItemType[]>({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await fetch(`/api/todo`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      const data = await res.json();

      return Array.isArray(data.todos)
        ? data.todos.map((todo: TodoItemType) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }))
        : [];
    },
  });

  if (isLoading) return <TodoListLoading />;

  // Optionally, if you still want to separate pinned and unpinned todos,
  // you can group each set by date.
  const pinnedTodos = todoList.filter((todo) => todo.pinned);
  const unpinnedTodos = todoList.filter((todo) => !todo.pinned);

  const groupedPinnedTodos = groupTodosByDate(pinnedTodos);
  const groupedUnpinnedTodos = groupTodosByDate(unpinnedTodos);

  return (
    <>
      {/* Render Pinned Todos */}
      {Object.entries(groupedPinnedTodos).map(([date, todos]) => (
        <div key={date}>
          <h3 className="text-lg font-bold my-4">{date}</h3>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todoItem={todo} />
          ))}
        </div>
      ))}

      {/* Show separator if there are pinned todos */}
      <LineSeparator className={pinnedTodos.length === 0 ? "hidden" : ""} />

      {/* Render Unpinned Todos */}
      {Object.entries(groupedUnpinnedTodos).map(([date, todos]) => (
        <div key={date}>
          <h3 className="text-lg font-bold my-4">{date}</h3>
          <LineSeparator className="m-0" />
          {todos.map((todo) => (
            <TodoItem key={todo.id} todoItem={todo} />
          ))}
        </div>
      ))}
    </>
  );
};

export default TodoList;
