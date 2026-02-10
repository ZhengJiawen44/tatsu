import React from "react";
import { useCompleteCalendarTodo } from "../query/complete-calendar-todo";
import { useCompleteCalendarTodoInstance } from "../query/complete-calendar-todo-instance";
import { TodoItemType } from "@/types";
import { useTranslations } from "next-intl";

export default function CompleteButton({
  todoItem,
}: {
  todoItem: TodoItemType;
}) {
  const { mutateComplete } = useCompleteCalendarTodo();
  const { mutateComplete: mutateInstanceComplete } =
    useCompleteCalendarTodoInstance();
  const calendarDict = useTranslations("shortcuts.calendar")

  return (
    <div className="flex justify-end p-3 ">
      <button
        onClick={() => {
          if (todoItem.instanceDate) {
            mutateInstanceComplete({ todoItem });
          } else {
            mutateComplete({ todoItem });
          }
        }}
        className="cursor-pointer border w-fit p-2 rounded-[0.5rem] bg-lime text-white hover:rounded-[100px] transition-all duration-200 ease-in"
      >
        {calendarDict("markComplete")}
      </button>
    </div>
  );
}
