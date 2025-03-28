import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todos/api/update-todo";
import { useCreateTodo } from "@/features/todos/api/create-todo";
import { TodoItemType } from "@/types";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns";
import TodoFormMenuStrip from "./TodoFormMenuStrip";
import { format } from "date-fns";

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
  const clearInput = useCallback(
    function clearInput() {
      if (todo?.startedAt) setDesc("");
      setTitle("");
      setDisplayForm(false);
      setDate({
        from: todo?.startedAt ? todo.startedAt : new Date(),
        to: todo?.expiresAt ? todo.expiresAt : endOfDay(new Date()),
      });
    },
    [setDisplayForm, todo?.expiresAt, todo?.startedAt]
  );

  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const [title, setTitle] = useState<string>(todo?.title || "");
  const [desc, setDesc] = useState<string>(todo?.description || "");
  const [priority, setPriority] = useState(todo?.priority || "Low");
  const [date, setDate] = useState<DateRange | undefined>({
    from: todo?.startedAt ? todo.startedAt : new Date(),
    to: todo?.expiresAt ? todo.expiresAt : endOfDay(new Date()),
  });
  const [expireTime, setExpireTime] = useState<string>(
    todo?.expiresAt.toTimeString().slice(0, 5) || "23:59"
  );
  const { editTodo, editLoading, isSuccess: editSuccess } = useEditTodo();
  const {
    createTodo,
    createLoading,
    isSuccess: createSuccess,
  } = useCreateTodo();

  if (todo?.expiresAt) console.log(format(todo?.expiresAt, "hh:mm:a"));

  // console.log(expireTime);
  //clear form on succesful mutation
  useEffect(() => {
    if (editSuccess) clearInput();
    if (createSuccess) clearInput();
  }, [editSuccess, createSuccess, clearInput]);

  useEffect(() => {
    adjustHeight(textareaRef);
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);

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
            date={date}
            setDate={setDate}
            expireTime={expireTime}
            setExpireTime={setExpireTime}
            priority={priority}
            setPriority={setPriority}
          />
          <Spinner
            className={clsx(
              "h-5 w-5",
              displayForm && !editLoading && !createLoading ? "hidden" : ""
            )}
          />

          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="border  px-2 bg-red hover:brightness-125 text-card sm:px-1 leading-none py-[2.5px] h-fit rounded-sm font-semibold"
              onClick={clearInput}
            >
              <p className="hidden sm:block">cancel</p>
              <p className="sm:hidden">X</p>
            </button>
            <button
              type="submit"
              disabled={title.length <= 0}
              className="flex gap-2 disabled:opacity-40 bg-lime hover:brightness-125 px-1 leading-none py-[2.5px] h-fit rounded-sm text-card font-semibold"
            >
              <p>{todo ? "save" : "add"}</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  async function handleForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (todo?.id) {
        editTodo({ id: todo.id, title, desc, priority, dateRange: date });
      } else {
        createTodo({ title, desc, priority, dateRange: date });
      }
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoFormConrtainer;
