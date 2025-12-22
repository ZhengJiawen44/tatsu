import clsx from "clsx";
import React, { useCallback, useEffect, useRef } from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todos/api/update-todo";
// import { useCreateTodo } from "@/features/todos/api/create-todo";
import { endOfDay, startOfDay } from "date-fns";
// import { useSession } from "next-auth/react";
import { useTodoForm } from "@/providers/TodoFormProvider";
import dynamic from "next/dynamic";
import { useEditTodoInstance } from "@/features/todos/api/update-todo-instance";
const TodoFormMenuStrip = dynamic(() => import("./TodoFormMenuStrip"));

interface TodoFormProps {
  editInstanceOnly: boolean;
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoForm = ({
  editInstanceOnly,
  setEditInstanceOnly,
  displayForm,
  setDisplayForm,
}: TodoFormProps) => {
  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const {
    todoItem: todo,
    title,
    setTitle,
    priority,
    setPriority,
    desc,
    setDesc,
    dateRange,
    setDateRange,
    rrule,
    setRrule,
  } = useTodoForm();

  const clearInput = useCallback(
    function clearInput() {
      setEditInstanceOnly(false);
      setDesc("");
      setTitle("");
      setDateRange({
        from: todo?.dtstart ? todo.dtstart : startOfDay(new Date()),
        to: todo?.due ? todo.due : endOfDay(new Date()),
      });
      setPriority("Low");
      setRrule(null);
      titleRef.current?.focus();
    },
    [setDisplayForm, todo?.due, todo?.dtstart],
  );

  const { editTodo, isError: editError } = useEditTodo();
  const { editTodoInstance, isError: editInstanceError } =
    useEditTodoInstance(setEditInstanceOnly);
  if (editError || editInstanceError) setDisplayForm(true);

  // const { createTodo } = useCreateTodo({
  //   setTitle,
  //   setDesc,
  //   setDateRange,
  //   setPriority,
  //   clearInput,
  // });

  // const { user } = useSession().data!;

  //adjust height of the todo description based on content size
  useEffect(() => {
    adjustHeight(textareaRef);
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);

  //submit form on ctrl + Enter
  useEffect(() => {
    const onCtrlEnter = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        console.log("submit");
        if (title && displayForm) {
          handleForm();
        }
      }
    };
    document.addEventListener("keydown", onCtrlEnter);
    return () => document.removeEventListener("keydown", onCtrlEnter);
  }, [title, desc, dateRange, priority]);

  const { toast } = useToast();

  return (
    <div
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form
        onSubmit={handleForm}
        className={clsx(
          "flex border flex-col my-4 rounded-md p-4 gap-3 w-full",
          !displayForm && "hidden",
        )}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={titleRef}
          className="w-full bg-transparent placeholder-card-foreground-muted text-card-foreground text-[1.2rem] font-semibold focus:outline-none"
          type="text"
          name="title"
          placeholder="finish chapter 5 in 7 days"
        />
        <textarea
          value={desc}
          ref={textareaRef}
          onChange={(e) => {
            setDesc(e.target.value);
            adjustHeight(textareaRef);
          }}
          className="w-full overflow-hidden bg-transparent placeholder-card-foreground-muted text-card-foreground font-extralight focus:outline-none resize-none"
          name="description"
          placeholder="description"
        />

        <LineSeparator />
        {/* footer tooltip */}
        <div className="max-w-full flex justify-between items-center overflow-clip text-sm sm:text-[1rem]">
          <TodoFormMenuStrip />

          <div className="flex gap-2 items-center text-sm">
            <button
              type="button"
              className="bg-card hover:bg-border hover:text-white text-card-foreground py-2 px-2 min-w-[4rem] leading-none h-fit rounded-md "
              onClick={() => {
                clearInput();
                setDisplayForm(false);
              }}
            >
              <p>cancel</p>
            </button>
            <button
              type="submit"
              disabled={title.length <= 0}
              className={clsx(
                "py-2 px-2 leading-none min-w-[4rem] h-fit rounded-md text-white bg-border",
                title.length > 0
                  ? "hover:bg-lime hover:text-black"
                  : "disabled opacity-40",
              )}
            >
              <p title="ctrl+enter">
                {editInstanceOnly ? "Save instance" : todo ? "save" : "add"}
              </p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  async function handleForm(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const dtstart = dateRange.from as Date;
    const due = dateRange.to as Date;
    try {
      if (todo?.id) {
        setDisplayForm(false);
        if (editInstanceOnly) {
          editTodoInstance({
            ...todo,
            title,
            description: desc,
            priority,
            dtstart,
            due,
            rrule,
          });
        } else {
          editTodo({
            ...todo,
            title,
            description: desc,
            priority,
            dtstart,
            due,
            rrule,
          });
        }
      } else {
        // createTodo({
        //   id: "-1",
        //   title,
        //   description: desc,
        //   priority,
        //   dtstart,
        //   due,
        //   order: Number.MAX_VALUE,
        //   userID: user!.id!,
        //   pinned: false,
        //   createdAt: new Date(),
        //   completed: false,
        //   repeatInterval,
        //   nextRepeatDate,
        // });
      }
    } catch (error) {
      setEditInstanceOnly(false);
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoForm;
