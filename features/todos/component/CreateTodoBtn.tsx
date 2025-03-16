"use client";
import React, { useState } from "react";
import TodoForm from "./TodoItem/TodoForm/TodoFormContainer";

import Plus from "@/components/ui/icon/plus";

const CreateTodoBtn = () => {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <div className="sticky -top-20 bg-card my-10 ml-[2px]">
      {/* add more icon */}
      <button
        onClick={() => setDisplayForm(!displayForm)}
        className="w-fit group flex gap-3 items-center  hover:cursor-pointer transition-all duration-200"
      >
        <Plus className="mb-[2px] -ml-1 w-5 h-5 stroke-card-foreground-muted group-hover:stroke-card-foreground" />
        <p className="text-card-foreground-muted text-[0.95rem] group-hover:text-card-foreground ">
          Add a task
        </p>
      </button>

      {/* form */}
      <TodoForm displayForm={displayForm} setDisplayForm={setDisplayForm} />
    </div>
  );
};

export default CreateTodoBtn;
