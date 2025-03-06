import React, { useState } from "react";
import { groupTodosByDate } from "@/lib/todo/groupTodo";
import LineSeparator from "../../ui/lineSeparator";
import { TodoItem } from "../TodoItem/TodoItemContainer";
import { TodoItemType } from "@/types";
import GroupedTodo from "./GroupedTodo";
import CreateTodoBtn from "../TodoMenu/CreateTodoBtn";
import PreviousTodo from "./PreviousTodo";

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

  const TodayTodo = Object.entries(groupedUnpinnedTodos).filter(
    ([date]) => date === "today"
  );
  const previousTodo = Object.entries(groupedUnpinnedTodos).filter(
    ([date]) => date !== "today"
  );

  return (
    <>
      {/* Render Unpinned previous todos */}
      <PreviousTodo
        groupedUnpinnedTodos={groupedUnpinnedTodos}
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
      />
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
      {/* <LineSeparator className={pinnedTodos.length === 0 ? "hidden" : ""} /> */}

      {TodayTodo.length <= 0 && <CreateTodoBtn />}
      {/* Render Unpinned today's Todos */}
      {TodayTodo.map(([date, todos]) => {
        if (date === "today") {
          return (
            <div key={date} className="mt-10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold select-none">{date}</h3>
                <LineSeparator className="flex-1" />
              </div>

              <GroupedTodo todos={todos} />
              <CreateTodoBtn />
            </div>
          );
        }
      })}
    </>
  );
};

export default TodoList;
