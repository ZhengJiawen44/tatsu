import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import adjustHeight from "@/lib/adjustTextareaHeight";
import { todoSchema } from "@/schema";
import { useToast } from "@/hooks/use-toast";
import Spinner from "../ui/spinner";
import LineSeparator from "../ui/lineSeparator";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const [title, setTitle] = useState<string>(todo?.title || "");
  const [desc, setDesc] = useState<string>(todo?.description || "");

  const { mutate: mutateCreate, isPending: createPending } = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const { mutate: mutateEdit, isPending: editPending } = useMutation({
    mutationFn: patchTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

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
        {/* buttons tooltip */}
        <div className="flex justify-between items-center w-full">
          <Spinner
            className={clsx(
              "h-5 w-5",
              !createPending || !editPending ? "hidden" : ""
            )}
          />
          <div className="flex gap-5 items-center mr-0 ml-auto">
            <button
              type="button"
              className="bg-card-muted px-1 leading-none py-[2.5px] h-fit rounded-sm font-semibold"
              onClick={() => {
                setDesc("");
                setTitle("");
                setDisplayForm(!displayForm);
              }}
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={title.length <= 0}
              className="disabled:opacity-40 bg-lime px-1 leading-none py-[2.5px] h-fit rounded-sm text-card font-semibold"
            >
              {todo ? "edit" : "add"}
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
        mutateEdit();
        return;
      }
      mutateCreate();
    } catch (error) {
      if (error instanceof Error) toast({ description: error.message });
    }
  }
  async function postTodo() {
    //validate input
    const parsedObj = todoSchema.safeParse({ title, description: desc });

    if (!parsedObj.success) {
      console.log(parsedObj.error.errors[0]);
      return;
    }
    const res = await fetch("/api/todo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsedObj.data),
    });

    const body = await res.json();
    const { message } = body;

    toast({ description: message });
    setDesc("");
    setTitle("");
    setDisplayForm(!displayForm);
  }
  async function patchTodo() {
    const id = todo?.id;
    if (!id) {
      toast({ description: "cannot find todo id" });
      return;
    }
    //validate input
    const parsedObj = todoSchema.safeParse({ title, description: desc });

    if (!parsedObj.success) {
      console.log(parsedObj.error.errors[0]);
      return;
    }
    const res = await fetch(`/api/todo/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsedObj.data),
    });

    const body = await res.json();
    const { message } = body;

    toast({ description: message });
    setDesc("");
    setTitle("");
    setDisplayForm(!displayForm);
  }
};

export default TodoForm;
