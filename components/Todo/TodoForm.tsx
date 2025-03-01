import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import adjustHeight from "@/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import Spinner from "../ui/spinner";
import LineSeparator from "../ui/lineSeparator";
import { useEditTodo, useCreateTodo } from "@/hooks/useTodo";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
}
interface TodoFormProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  todo?: TodoItem;
}

const TodoForm = ({ displayForm, setDisplayForm, todo }: TodoFormProps) => {
  const clearInput = useCallback(
    function clearInput() {
      setDesc("");
      setTitle("");
      setDisplayForm(!displayForm);
    },
    [displayForm, setDisplayForm]
  );

  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const [title, setTitle] = useState<string>(todo?.title || "");
  const [desc, setDesc] = useState<string>(todo?.description || "");

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
    <div>
      <form
        onSubmit={handleForm}
        className={clsx(
          "flex flex-col my-4 border rounded-md p-3 gap-3",
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
        editTodo({ id: todo.id, title, desc });
      } else {
        createTodo({ title, desc });
      }
    } catch (error) {
      if (error instanceof Error) toast({ description: error.message });
    }
  }
};

export default TodoForm;
