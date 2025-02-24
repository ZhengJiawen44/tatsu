import React from "react";
import TodoListLoading from "../ui/TodoListLoading";
import LineSeparator from "../ui/lineSeparator";
import { TodoItem } from "./TodoItem";
import { getDisplayDate } from "@/lib/displayDate";
import { TodoItemType } from "@/types";
import { useTodo } from "@/hooks/useTodo";

// Helper function to group todos by their display date
const groupTodosByDate = (todos: TodoItemType[]) => {
  return todos.reduce((groups: Record<string, TodoItemType[]>, todo) => {
    if (!todo.completed) {
      // Only include uncompleted todos
      const dateKey = getDisplayDate(todo.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(todo);
    }
    return groups;
  }, {});
};

const TodoList = () => {
  //see useTodo hook on how todos are fetched and mutated
  const { todos, todoLoading } = useTodo();

  if (todoLoading) return <TodoListLoading />;

  //group each set by date.
  const pinnedTodos = todos.filter((todo) => todo.pinned);
  const unpinnedTodos = todos.filter((todo) => !todo.pinned);

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
