import React, { useEffect, useState } from "react";
import TodoListLoading from "../ui/TodoListLoading";
import LineSeparator from "../ui/lineSeparator";
import { TodoItem } from "./TodoItem";
import { getDisplayDate } from "@/lib/displayDate";
import { TodoItemType } from "@/types";
import { useTodo } from "@/hooks/useTodo";
import CaretOutline from "../ui/icon/caretOutline";
import clsx from "clsx";

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

const TodoList = ({ todos }: { todos: TodoItemType[] }) => {
  //group each set by date.
  const pinnedTodos = todos.filter((todo) => todo.pinned && !todo.completed);
  const unpinnedTodos = todos.filter((todo) => !todo.pinned && !todo.completed);

  const groupedPinnedTodos = groupTodosByDate(pinnedTodos);
  const groupedUnpinnedTodos = groupTodosByDate(unpinnedTodos);

  //create a map to keep track of openstates of grouped dates
  const initialOpenState = Object.keys(groupedUnpinnedTodos).reduce(
    (acc, curr) => {
      if (curr === "today") {
        acc[curr] = true;
        return acc;
      }
      acc[curr] = false;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const [openDetails, setOpenDetails] =
    useState<Record<string, boolean>>(initialOpenState);

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
          <details
            name={date}
            className="rounded-md p-2"
            open={openDetails[date] === true}
            onClick={(e) => {
              e.preventDefault();
              setOpenDetails((prev) => {
                return { ...prev, [date]: !prev[date] };
              });
            }}
          >
            <summary className="relative flex items-center gap-2 text-lg font-medium">
              <div className="flex w-fit items-center gap-2 cursor-pointer">
                <CaretOutline
                  className={clsx(
                    "w-4 h-4 absolute -left-6",
                    openDetails[date] === true && "rotate-90"
                  )}
                />

                <h3 className="text-lg font-semibold select-none">{date}</h3>
              </div>
              <LineSeparator className="flex-1" />
            </summary>

            {todos.map((todo) => (
              <TodoItem key={todo.id} todoItem={todo} />
            ))}
          </details>
        </div>
      ))}
    </>
  );
};

export default TodoList;
