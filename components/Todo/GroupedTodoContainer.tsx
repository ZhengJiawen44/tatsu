import React, { useState } from "react";
import { groupTodosByDate } from "@/lib/todo/groupTodo";
import LineSeparator from "../ui/lineSeparator";
import { TodoItem } from "./TodoItem";
import { TodoItemType } from "@/types";
import CaretOutline from "../ui/icon/caretOutline";
import clsx from "clsx";
import GroupedTodo from "./GroupedTodo";

const TodoList = ({ todos }: { todos: TodoItemType[] }) => {
  //separate the pinned from unpinned todos
  const pinnedTodos = todos.filter((todo) => todo.pinned && !todo.completed);
  const unpinnedTodos = todos.filter((todo) => !todo.pinned && !todo.completed);

  //group the pinned and unpinned todos. creates an object like {"today": [todos], "march 6": [todos]}
  const groupedPinnedTodos = groupTodosByDate(pinnedTodos) as Record<
    string,
    TodoItemType[]
  >;

  const groupedUnpinnedTodos = groupTodosByDate(unpinnedTodos) as Record<
    string,
    TodoItemType[]
  >;

  //sort the todos
  Object.entries(groupedPinnedTodos).forEach(([date, todoList]) => {
    todoList.sort((a, b) => a.order - b.order);
  });
  Object.entries(groupedUnpinnedTodos).forEach(([date, todoList]) => {
    todoList.sort((a, b) => a.order - b.order);
  });

  console.log(groupedUnpinnedTodos);

  //initializes a mapping between dates and open state to keep track of open states of grouped dates
  const initialOpenState = Object.keys(groupedUnpinnedTodos).reduce(
    (acc, curr) => {
      if (curr !== "today") {
        acc[curr] = false;
        return acc;
      }
      //today's todos are opened by default
      acc[curr] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );

  //state to control the mapping
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
                    "w-6 h-6 absolute -left-7 hover:bg-border rounded-md p-1 transition-all duration-200",
                    openDetails[date] === true && "rotate-90"
                  )}
                />

                <h3 className="text-lg font-semibold select-none">{date}</h3>
              </div>
              <LineSeparator className="flex-1" />
            </summary>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <GroupedTodo todos={todos} />
            </div>
          </details>
        </div>
      ))}
    </>
  );
};

export default TodoList;
