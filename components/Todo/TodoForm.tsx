import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import adjustHeight from "@/lib/adjustTextareaHeight";

interface TodoFormProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<boolean>;
}

const TodoForm = ({ displayForm, setDisplayForm }: TodoFormProps) => {
  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    adjustHeight(textareaRef);
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);

  return (
    <div>
      <form
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
        <div className="flex gap-5 items-center mt-3 mr-0 ml-auto">
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
          <button className="bg-lime px-1 leading-none py-[2.5px] h-fit rounded-sm text-card font-semibold">
            add
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
