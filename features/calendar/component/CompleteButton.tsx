import React from "react";
import { useCompleteCalendarTodo } from "../api/complete-calendar-todo";
export default function CompleteButton({ id }: { id: string }) {
  const { mutateComplete } = useCompleteCalendarTodo();
  return (
    <div className="flex justify-end p-3 ">
      <button
        onClick={() => mutateComplete(id)}
        className="border w-fit p-2 rounded-[0.5rem] bg-lime text-white hover:rounded-[100px] transition-all duration-200 ease-in"
      >
        Mark complete
      </button>
    </div>
  );
}
