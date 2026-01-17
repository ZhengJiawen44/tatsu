import clsx from "clsx";
import React from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todos/query/update-todo";
import { useCreateTodo } from "@/features/todos/query/create-todo";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useEditTodoInstance } from "@/features/todos/query/update-todo-instance";
import { useTodoFormFocusAndAutosize } from "@/features/todos/hooks/useTodoFormFocusAndAutosize";
import { useKeyboardSubmitForm } from "@/features/todos/hooks/useKeyboardSubmitForm";
import { useClearInput } from "@/features/todos/hooks/useClearInput";
import { RRule } from "rrule";
import TodoInlineActionBar from "./TodoInlineActionBar/TodoInlineActionBar";
import { Button } from "@/components/ui/button";
interface TodoFormProps {
  editInstanceOnly?: boolean;
  setEditInstanceOnly?: React.Dispatch<React.SetStateAction<boolean>>;
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
  const { createTodo } = useCreateTodo();

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
          "flex border bg-card shadow-md flex-col my-4 rounded-md p-4 gap-3 w-full",
          !displayForm && "hidden",
        )}
      >
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            const rule = RRule.fromText(title).toText();
            console.log(rule);
          }}
          ref={titleRef}
          className="w-full bg-transparent placeholder-foreground text-[1.1rem] font-semibold focus:outline-none"
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
          className="w-full overflow-hidden bg-transparent  placeholder-muted-foreground font-extralight focus:outline-none resize-none"
          name="description"
          placeholder="description"
        />
        <LineSeparator />

        <div className="max-w-full flex justify-between items-center overflow-clip text-sm sm:text-[1rem]">
          {/* DateRange, Priority, and Repeat menus */}
          <TodoInlineActionBar />
          <div className="flex gap-2 items-center text-sm">
            <Button
              variant={"outline"}
              type="button"
              className="h-fit bg-accent"
              onClick={() => {
                clearInput();
                setDisplayForm(false);
              }}
            >
              <p>cancel</p>
            </Button>
            <Button
              type="submit"
              variant={"default"}
              disabled={title.length <= 0}
              className={clsx(
                "h-fit",
                title.length <= 0 && "disabled opacity-40 !cursor-not-allowed",
              )}
            >
              <p title="ctrl+enter">
                {editInstanceOnly ? "Save instance" : todo ? "save" : "add"}
              </p>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );

  async function handleForm(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const dtstart = dateRange.from;
    const due = dateRange.to;
    try {
      const rrule = rruleOptions ? new RRule(rruleOptions).toString() : null;
      if (todo?.id) {
        setDisplayForm(false);
        if (editInstanceOnly) {
          console.log(
            "%c [  ]-143",
            "font-size:13px; background:pink; color:#bf2c9f;",
            todo.instanceDate,
          );
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
        clearInput();
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
          exdates: [],
          instanceDate: dtstart,
          instances: [],
        });
      }
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoForm;
