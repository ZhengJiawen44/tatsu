import React, { useEffect, useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import PreviousTodo from "./PreviousTodo";
import { useTodo } from "../api/get-todo";
import Day from "./Day";
import TodoListLoading from "./TodoListLoading";
import { groupTodo } from "@/features/todos/lib/groupTodo";
import TodayTodos from "./TodayTodos";
import PinnedTodos from "./PinnedTodos";
import { useNotificaton } from "@/providers/NotificationProvider";
import { useToast } from "@/hooks/use-toast";
import Plus from "@/components/ui/icon/plus";
import clsx from "clsx";
import LineSeparator from "@/components/ui/lineSeparator";

const TodoContainer = () => {
  //get all todos
  const { toast } = useToast();
  const { todos, todoLoading } = useTodo();
  const { notification, setNotification } = useNotificaton();
  // Destructure the result for cleaner access
  const { groupedPinnedTodos, groupedUnPinnedTodos } = groupTodo({ todos });

  //initializes a mapping between dates and open state to keep track of open states of grouped dates
  const initialOpenState = Object.keys(groupedUnPinnedTodos).reduce(
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

  //state to control the mapping, genrated a maping of  Record<date:boolean>
  const [openGroupedTodoMap, setOpenGroupedTodoMap] =
    useState<Record<string, boolean>>(initialOpenState);

  //get today's todo list
  const TodayTodoList = Object.entries(groupedUnPinnedTodos).filter(
    ([date]) => {
      return date === "today";
    }
  );

  const [showNotification, setShowNotification] = useState(() => {
    return JSON.parse(localStorage.getItem("showNotification") || "true");
  });

  useEffect(() => {
    localStorage.setItem("showNotification", JSON.stringify(showNotification));
  }, [showNotification]);

  if (todoLoading) <TodoListLoading />;

  return (
    <div className="select-none bg-card">
      <div
        className={clsx(
          "relative w-full my-4 rounded-lg border border-gray-700 bg-gray-800 p-4 text-[0.9rem] text-gray-300 shadow-md",
          !showNotification && "hidden"
        )}
      >
        <div className="pr-8">
          <p className="mb-1">
            Thank you for trying out
            <span className="font-semibold text-white">Tatsu.gg</span>! We
            appreciate you exploring our demo and value your feedback.
          </p>
          <p>
            A special shoutout to
            <span className="text-yellow-400 font-semibold">
              JustPowerful Plays
            </span>
            for catching an issue where the sidebar toggle shortcut conflicts
            with the rich text editor’s bold command.
            <span className="italic"> You have my gratitude.</span>
          </p>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
          onClick={() => setShowNotification(false)}
        >
          <Plus className="w-5 h-5 rotate-45" />
        </button>
      </div>

      <Day />
      {/* Render Unpinned previous todos */}
      <PreviousTodo
        groupedUnpinnedTodos={groupedUnPinnedTodos}
        openDetails={openGroupedTodoMap}
        setOpenDetails={setOpenGroupedTodoMap}
      />

      {/* Render Pinned Todos */}
      <PinnedTodos groupedPinnedTodos={groupedPinnedTodos} />

      {/* render creare todo btn incase no todos for today */}
      {TodayTodoList.length <= 0 && <CreateTodoBtn />}

      {/* Render Unpinned today's Todos */}
      {TodayTodoList.map(([date, todos]) => {
        return <TodayTodos key={date} todos={todos} />;
      })}
    </div>
  );
};

export default TodoContainer;
