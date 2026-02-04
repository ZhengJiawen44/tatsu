import clsx from "clsx";
import React, { useState } from "react";
import adjustHeight from "@/components/todo/lib/adjustTextareaHeight";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useTodoFormFocusAndAutosize } from "@/components/todo/hooks/useTodoFormFocusAndAutosize";
import { useKeyboardSubmitForm } from "@/components/todo/hooks/useKeyboardSubmitForm";
import { useClearInput } from "@/components/todo/hooks/useClearInput";
import { RRule } from "rrule";
import TodoInlineActionBar from "./TodoInlineActionBar/TodoInlineActionBar";
import { Button } from "@/components/ui/button";
import NLPTitleInput from "./NLPTitleInput";
import { useTranslations } from "next-intl";
import { useTodoMutation } from "@/providers/TodoMutationProvider";
import { useCreateTodo } from "@/features/todayTodos/query/create-todo";
import ProjectDropdownMenu from "./ProjectDropdownMenu";
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
    projectID,
    setProjectID,
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
  const { useEditTodo, useEditTodoInstance } = useTodoMutation();
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
          "flex border  bg-card shadow-md flex-col rounded-md w-full transition-colors",
          !displayForm && "hidden",
          isFocused ? "border-muted-foreground" : "border-border",
        )}
      >
        <div className="flex flex-col gap-3  mb-4">
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
        </div>
        <LineSeparator className="!m-0 !p-0" />
        {/* form footer */}
        <div className="flex text-sm w-full justify-between items-center py-1.5 px-2">
          <ProjectDropdownMenu projectID={projectID} setProjectID={setProjectID} />
          <div className="flex gap-3 w-fit">
            <Button
              variant={"outline"}
              type="button"
              className="h-fit bg-accent !py-[0.3rem] border-none"
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
      if (todo?.id && todo.id != "-1") {
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
            projectID
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
          instanceDate: rrule ? dtstart : null,
          instances: [],
          projectID
        });
      }
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
    }
  }
};

export default TodoForm;
