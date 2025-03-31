import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todos/api/update-todo";
import { useCreateTodo } from "@/features/todos/api/create-todo";
import { TodoItemType } from "@/types";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns";
import TodoFormMenuStrip from "./TodoFormMenuStrip";

interface TodoFormConrtainerProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  todo?: TodoItemType;
}

const TodoFormConrtainer = ({
  displayForm,
  setDisplayForm,
  todo,
}: TodoFormConrtainerProps) => {
  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const clearInput = useCallback(
    function clearInput() {
      setDesc("");
      setTitle("");
      setDateRange({
        from: todo?.startedAt ? todo.startedAt : new Date(),
        to: todo?.expiresAt ? todo.expiresAt : endOfDay(new Date()),
      });
      setPriority("Low");
      titleRef.current?.focus();
    },
    [setDisplayForm, todo?.expiresAt, todo?.startedAt]
  );

  const [title, setTitle] = useState<string>(todo?.title || "");
  const [desc, setDesc] = useState<string>(todo?.description || "");
  const [priority, setPriority] = useState(todo?.priority || "Low");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: todo?.startedAt ? todo.startedAt : new Date(),
    to: todo?.expiresAt ? todo.expiresAt : endOfDay(new Date()),
  });
  const [expireTime, setExpireTime] = useState<string>(
    todo?.expiresAt.toTimeString().slice(0, 5) || "23:59"
  );
  const { editTodo, isSuccess: editSuccess } = useEditTodo();
  const { createTodo, isSuccess: createSuccess } = useCreateTodo({
    setTitle,
    setDesc,
    setDateRange,
    setPriority,
    clearInput,
  });

  // console.log(expireTime);
  //clear form on succesful mutation
  useEffect(() => {
    if (editSuccess) {
      clearInput();
      setDisplayForm(false);
    }
  }, [editSuccess, createSuccess, clearInput]);

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
          !displayForm && "hidden"
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
          <TodoFormMenuStrip
            todo={todo}
            dateRange={dateRange}
            setDateRange={setDateRange}
            expireTime={expireTime}
            setExpireTime={setExpireTime}
            priority={priority}
            setPriority={setPriority}
          />

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
                  : "disabled opacity-40"
              )}
            >
              <p title="ctrl+enter">{todo ? "save" : "add"}</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  async function handleForm(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      if (todo?.id) {
        editTodo({ id: todo.id, title, desc, priority, dateRange: dateRange });
      } else {
        createTodo({ title, desc, priority, dateRange: dateRange });
      }
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoFormConrtainer;
