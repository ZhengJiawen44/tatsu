"use client";
import React, { useState } from "react";
import PlusOutline from "../ui/icon/plusOutline";
import TodoForm from "./TodoForm";
import LineSeparator from "../ui/lineSeparator";

const Tooltip = () => {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <div className="pt-10 sticky top-0 bg-card z-10">
      {/* add more icon */}
      <button
        onClick={() => setDisplayForm(!displayForm)}
        className="w-fit group flex gap-3 items-center  hover:cursor-pointer transition-all duration-200"
      >
        <PlusOutline className=" -ml-1 w-6 h-6 stroke-card-foreground-muted group-hover:stroke-card-foreground" />
        <p className="text-card-foreground-muted text-[0.95rem] group-hover:text-card-foreground leading-none">
          Add a task
        </p>
      </button>

      {/* form */}
      <TodoForm displayForm={displayForm} setDisplayForm={setDisplayForm} />
      <LineSeparator className="my-6" />
    </div>
  );
};

export default Tooltip;
