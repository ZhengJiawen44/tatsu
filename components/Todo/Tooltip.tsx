"use client";
import React, { useEffect, useRef, useState } from "react";
import PlusOutline from "../ui/icon/plusOutline";
import TodoForm from "./TodoForm";

const Tooltip = () => {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <>
      {/* add more icon */}
      <button
        onClick={() => setDisplayForm(!displayForm)}
        className="w-fit group flex p-[8px] gap-3 items-center rounded-xl hover:cursor-pointer transition-all duration-200"
      >
        <PlusOutline className="w-6 h-6 stroke-card-foreground-muted group-hover:stroke-card-foreground" />
        <p className="text-card-foreground-muted text-[0.95rem] group-hover:text-card-foreground leading-none">
          Add a task
        </p>
      </button>

      {/* form */}
      <TodoForm displayForm={displayForm} setDisplayForm={setDisplayForm} />
    </>
  );
};

export default Tooltip;
