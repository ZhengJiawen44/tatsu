import React from "react";
import { useCompleteCalendarTodo } from "../query/complete-calendar-todo";
import { useCompleteCalendarTodoInstance } from "../query/complete-calendar-todo-instance";
import { CalendarTodoItemType } from "@/types";
export default function CompleteButton({
  todoItem,
}: {
  todoItem: CalendarTodoItemType;
}) {
  const { mutateComplete } = useCompleteCalendarTodo();
  const { mutateComplete: mutateInstanceComplete } =
    useCompleteCalendarTodoInstance();

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
        className="border w-fit p-2 rounded-[0.5rem] bg-lime text-white hover:rounded-[100px] transition-all duration-200 ease-in"
      >
        Mark complete
      </button>
    </div>
  );
}
