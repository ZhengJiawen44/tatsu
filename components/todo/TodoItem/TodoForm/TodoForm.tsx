import clsx from "clsx";
import React, { useState } from "react";
import adjustHeight from "@/features/todayTodos/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useEditTodo } from "@/features/todayTodos/query/update-todo";
import { useCreateTodo } from "@/features/todayTodos/query/create-todo";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useEditTodoInstance } from "@/features/todayTodos/query/update-todo-instance";
import { useTodoFormFocusAndAutosize } from "@/features/todayTodos/hooks/useTodoFormFocusAndAutosize";
import { useKeyboardSubmitForm } from "@/features/todayTodos/hooks/useKeyboardSubmitForm";
import { useClearInput } from "@/features/todayTodos/hooks/useClearInput";
import { RRule } from "rrule";
import TodoInlineActionBar from "./TodoInlineActionBar/TodoInlineActionBar";
import { Button } from "@/components/ui/button";
import NLPTitleInput from "./NLPTitleInput";
import { useTranslations } from "next-intl";

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
    setDateRange,
    rruleOptions,
    dateRangeChecksum,
    rruleChecksum,
  } = useTodoForm();

  //adjust height of the todo description based on content size
  const { titleRef, textareaRef } = useTodoFormFocusAndAutosize(displayForm);
  const [isFocused, setIsFocused] = useState(false);
  //submit form on ctrl + Enter
  useKeyboardSubmitForm(displayForm, handleForm);
  const { toast } = useToast();
  const clearInput = useClearInput(setEditInstanceOnly, titleRef);
  const { editTodoMutateFn } = useEditTodo();
  const { editTodoInstanceMutateFn } = useEditTodoInstance(setEditInstanceOnly);
  const { createMutateFn } = useCreateTodo();
  const appDict = useTranslations("app");
  const todayDict = useTranslations("today")

  return (
    <div
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form
        onFocus={() => setIsFocused(true)}
        onSubmit={handleForm}
        onBlur={() => setIsFocused(false)}
        className={clsx(
          "flex border bg-card shadow-md flex-col my-4 rounded-md gap-3 w-full transition-colors",
          !displayForm && "hidden",
          isFocused ? "border-muted-foreground" : "border-border",
        )}
      >
        <NLPTitleInput
          className="px-2 mt-5"
          title={title}
          setTitle={setTitle}
          titleRef={titleRef}
          setDateRange={setDateRange}
        />

        <textarea
          value={desc}
          ref={textareaRef}
          onChange={(e) => {
            setDesc(e.target.value);
            adjustHeight(textareaRef);
          }}
          className="px-2 w-full overflow-hidden bg-transparent my-1 placeholder-muted-foreground font-extralight focus:outline-none resize-none"
          name="description"
          placeholder={appDict("descPlaceholder")}
        />

        {/* DateRange, Priority, and Repeat menus */}
        <TodoInlineActionBar />
        <LineSeparator />
        <div className="flex gap-2 text-sm w-fit ml-auto pb-2 px-2 ">
          <Button
            variant={"outline"}
            type="button"
            className="h-fit bg-accent !py-[0.3rem]"
            onClick={() => {
              clearInput();
              setDisplayForm(false);
            }}
          >
            {appDict("cancel")}
          </Button>
          <Button
            type="submit"
            variant={"default"}
            disabled={title.length <= 0}
            className={clsx(
              "h-fit !py-[0.3rem]",
              title.length <= 0 && "disabled opacity-40 !cursor-not-allowed",
            )}
          >
            <p title="ctrl+enter">
              {editInstanceOnly ? todayDict("saveInstance") : appDict("save")}
            </p>
          </Button>
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
          editTodoInstanceMutateFn({
            ...todo,
            title,
            description: desc,
            priority,
            dtstart,
            due,
            rrule,
          });
        } else {
          editTodoMutateFn({
            ...todo,
            dateRangeChecksum,
            rruleChecksum,
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
        createMutateFn({
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
