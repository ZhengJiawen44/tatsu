import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
interface TodoFormProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<boolean>;
}
const TodoForm = ({ displayForm, setDisplayForm }: TodoFormProps) => {
  const titleRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to min to accurately calculate new height
      textarea.style.height = "auto";
      // Set new height based on scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // Initial height adjustment
    adjustHeight();
  }, []);

  return (
    <div>
      <form
        className={clsx(
          "flex flex-col my-4 border rounded-md p-3 ",
          !displayForm && "hidden"
        )}
      >
        <input
          ref={titleRef}
          className="bg-transparent placeholder-card-foreground-muted text-card-foreground text-[1.2rem] font-semibold focus:outline-none"
          type="text"
          name="title"
          placeholder="finish chapter 5 in 7 days"
        />

        <textarea
          ref={textareaRef}
          onChange={adjustHeight}
          className="h-auto bg-transparent placeholder-card-foreground-muted text-card-foreground focus:outline-none resize-none"
          name="description"
          defaultValue="description"
        ></textarea>

        <div className="mt-3 w-full h-1 border-b-[1px]"></div>
        {/* buttons tooltip */}
        <div className="flex gap-5 items-center mt-3 mr-0 ml-auto">
          <button
            className="bg-card-muted px-1 leading-none py-[2.5px] h-fit rounded-sm font-semibold"
            onClick={() => setDisplayForm(!displayForm)}
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
