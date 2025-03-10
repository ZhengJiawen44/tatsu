import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import adjustHeight from "@/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import Spinner from "../../../ui/spinner";
import LineSeparator from "../../../ui/lineSeparator";
import { useEditTodo, useCreateTodo } from "@/hooks/useTodo";
import { TodoItemType } from "@/types";
import { DateRange } from "react-day-picker";
import DayPicker from "../DayPicker";
import { addDays, endOfDay } from "date-fns";
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
  const clearInput = useCallback(
    function clearInput() {
      setDesc("");
      setTitle("");
      setDisplayForm(false);
      setDate({
        from: todo?.startedAt ? todo.startedAt : new Date(),
        to: todo?.expiresAt ? todo.expiresAt : addDays(new Date(), 0),
      });
    },
    [setDisplayForm]
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

  const { editTodo, editLoading, isSuccess: editSuccess } = useEditTodo();
  const {
    createTodo,
    createLoading,
    isSuccess: createSuccess,
  } = useCreateTodo();

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
      className=""
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form
        onSubmit={handleForm}
        className={clsx(
          "flex border flex-col my-4 rounded-md p-3 gap-3",
          !displayForm && "hidden"
        )}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={titleRef}
          className="bg-transparent placeholder-card-foreground-muted text-card-foreground text-[1.2rem] font-semibold focus:outline-none"
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
          className="overflow-hidden bg-transparent placeholder-card-foreground-muted text-card-foreground font-extralight focus:outline-none resize-none"
          name="description"
          placeholder="description"
        />

        <LineSeparator />
        {/* footer tooltip */}
        <div className="flex justify-between items-center w-full">
          <TodoFormMenuStrip
            todo={todo}
            date={date}
            setDate={setDate}
            priority={priority}
            setPriority={setPriority}
          />
          <Spinner
            className={clsx(
              "h-5 w-5",
              displayForm && !editLoading && !createLoading ? "hidden" : ""
            )}
          />

          <div className="flex gap-5 items-center mr-0 ml-auto">
            <button
              type="button"
              className="bg-card-muted px-1 leading-none py-[2.5px] h-fit rounded-sm font-semibold"
              onClick={clearInput}
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={title.length <= 0}
              className="flex gap-2 disabled:opacity-40 bg-lime px-1 leading-none py-[2.5px] h-fit rounded-sm text-card font-semibold"
            >
              {todo ? "save" : "add"}
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
      if (error instanceof Error) toast({ description: error.message });
    }
  }
};

export default TodoFormConrtainer;
