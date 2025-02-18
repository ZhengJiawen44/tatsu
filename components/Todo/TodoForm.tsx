import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import adjustHeight from "@/lib/adjustTextareaHeight";
import { todoSchema } from "@/schema";
import { useToast } from "@/hooks/use-toast";
import Spinner from "../ui/spinner";
interface TodoFormProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<boolean>;
}

const TodoForm = ({ displayForm, setDisplayForm }: TodoFormProps) => {
  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [loading, setLoading] = useState(false);

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

        <div className="mt-1 w-full h-1 border-b-[1px]"></div>
        {/* buttons tooltip */}
        <div className="flex justify-between items-center w-full">
          <Spinner className={clsx("h-5 w-5", !loading && "hidden")} />
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
              disabled={title.length <= 0}
              className="disabled:opacity-40 bg-lime px-1 leading-none py-[2.5px] h-fit rounded-sm text-card font-semibold"
            >
              add
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  async function handleForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      //validate data
      const parsedObj = todoSchema.safeParse({ title, desc });
      if (!parsedObj.success) return;

      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsedObj.data),
      });

      const body = await res.json();
      const { message } = body;

      toast({ description: message });
    } catch (error) {
      if (error instanceof Error) toast({ description: error.message });
    } finally {
      setLoading(false);
    }
  }
};

export default TodoForm;
