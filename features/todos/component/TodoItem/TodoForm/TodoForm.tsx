import clsx from "clsx";
import React, { useEffect } from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todos/api/update-todo";
import { useCreateTodo } from "@/features/todos/api/create-todo";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useEditTodoInstance } from "@/features/todos/api/update-todo-instance";
import { useTodoFormFocusAndAutosize } from "@/features/todos/hooks/useTodoFormFocusAndAutosize";
import { useKeyboardSubmitForm } from "@/features/todos/hooks/useKeyboardSubmitForm";
import { useClearInput } from "@/features/todos/hooks/useClearInput";
import { RRule } from "rrule";
import TodoInlineActionBar from "./TodoInlineActionBar/TodoInlineActionBar";
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
  const {
    todoItem: todo,
    title,
    setTitle,
    priority,
    desc,
    setDesc,
    dateRange,
    rruleOptions,
    instanceDate,
    dateRangeChecksum,
  } = useTodoForm();

  //adjust height of the todo description based on content size
  const { titleRef, textareaRef } = useTodoFormFocusAndAutosize(displayForm);
  //submit form on ctrl + Enter
  useKeyboardSubmitForm(displayForm, handleForm);
  const { toast } = useToast();
  const clearInput = useClearInput(setEditInstanceOnly, titleRef);
  const { editTodo } = useEditTodo();
  const { editTodoInstance } = useEditTodoInstance(setEditInstanceOnly);
  const { createTodo, createTodoStatus } = useCreateTodo();

  useEffect(() => {
    if (createTodoStatus === "success") clearInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTodoStatus]);

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

        <div className="max-w-full flex justify-between items-center overflow-clip text-sm sm:text-[1rem]">
          {/* DateRange, Priority, and Repeat menus */}
          <TodoInlineActionBar />
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

    // if (
    //   dateRangeChecksum ===
    //   dateRange.from.toISOString() + dateRange.to.toISOString()
    // ) {
    //   console.log("date range was not changed");
    // } else {
    //   console.log("date range was changed");
    // }
    // console.log(
    //   dateRangeChecksum,
    //   dateRange.from.toISOString() + dateRange.to.toISOString(),
    // );
    const dtstart = dateRange.from;
    const due = dateRange.to;
    try {
      const rrule = rruleOptions ? new RRule(rruleOptions).toString() : null;
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
            instanceDate,
          });
        } else {
          editTodo({
            ...todo,
            dateRangeChecksum,
            title,
            description: desc,
            priority,
            dtstart,
            due,
            rrule,
          });
        }
      } else {
        createTodo({
          id: "-1",
          title,
          description: desc,
          priority,
          dtstart,
          due,
          rrule,
          order: Number.MAX_VALUE,
          createdAt: new Date(),
          completed: false,
          durationMinutes: 30,
          pinned: false,
          timeZone: "",
          userID: "",
        });
      }
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoForm;
