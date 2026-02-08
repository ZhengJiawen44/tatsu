"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Plus from "@/components/ui/icon/plus";
import TodoFormLoading from "../../../components/todo/component/TodoForm/TodoFormLoading";
import { useTranslations } from "next-intl";
const TodoForm = dynamic(
  () => import("../../../components/todo/component/TodoForm/TodoFormContainer"),
  { loading: () => <TodoFormLoading /> },
);

const CreateTodoBtn = ({ projectID }: { projectID?: string }) => {
  const todayDict = useTranslations("today");
  const [displayForm, setDisplayForm] = useState(false);
  useEffect(() => {
    const showCreateTodoForm = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      )
        return;
      if (e.key.toLocaleLowerCase() === "q") {
        e.preventDefault();
        setDisplayForm(true);
      }
      return;
    };


    document.addEventListener("keydown", showCreateTodoForm);
    return () => {
      document.removeEventListener("keydown", showCreateTodoForm);
    };
  }, []);
  return (
    <div className="sticky -top-20 my-10 ml-0.5">
      {/* add more icon */}
      <button
        onClick={() => setDisplayForm(!displayForm)}
        className="w-fit group flex gap-3 items-center  hover:cursor-pointer transition-all duration-200"
      >
        <Plus className="mb-[2px] -ml-1 w-5 h-5 stroke-muted-foreground group-hover:stroke-foreground" />
        <p className="text-muted-foreground text-[0.95rem] group-hover:text-foreground ">
          {todayDict("addATask")}
        </p>
      </button>

      {/* form */}
      {displayForm && (
        <TodoForm displayForm={displayForm} setDisplayForm={setDisplayForm} overrideFields={{ projectID }} />
      )}
    </div>
  );
};

export default CreateTodoBtn;
