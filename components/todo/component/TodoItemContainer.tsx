import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TodoCheckbox from "@/components/ui/TodoCheckbox";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoItemType } from "@/types";
import GripVertical from "@/components/ui/icon/gripVertical";
import TodoFormLoading from "./TodoForm/TodoFormLoading";
import { Check } from "lucide-react";
import TodoItemMenuContainer from "./TodoItem/TodoMenu/TodoItemMenuContainer";
import LineSeparator from "@/components/ui/lineSeparator";
import { getDisplayDate } from "@/lib/date/displayDate";
import { useLocale } from "next-intl";
import { useTodoMutation } from "@/providers/TodoMutationProvider";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";

const TodoFormContainer = dynamic(
  () => import("./TodoForm/TodoFormContainer"),
  { loading: () => <TodoFormLoading /> },
);

type TodoItemContainerProps = {
  todoItem: TodoItemType,
  overdue?: boolean
}

export const TodoItemContainer = ({ todoItem, overdue }: TodoItemContainerProps) => {
  const { projectMetaData } = useProjectMetaData();
  const { useCompleteTodo } = useTodoMutation();
  const { completeMutateFn } = useCompleteTodo();
  const locale = useLocale();
  //dnd kit setups
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const { title, description, completed, priority, rrule, dtstart } = todoItem;
  const [displayForm, setDisplayForm] = useState(false);
  const [editInstanceOnly, setEditInstanceOnly] = useState(false);
  const [showHandle, setShowHandle] = useState(false);
  const [isGrabbing, setGrabbing] = useState(false);


  useEffect(() => {
    if (!displayForm) {
      setShowHandle(false);
    }
  }, [displayForm]);
  useEffect(() => {
    const exitCreateTodoForm = (e: KeyboardEvent) => {
      if (e.code === "Escape") setDisplayForm(false);
      return;
    };
    document.addEventListener("keydown", exitCreateTodoForm);
    return () => {
      document.removeEventListener("keydown", exitCreateTodoForm);
    };
  }, []);

  if (displayForm)
    return (
      <TodoFormContainer
        editInstanceOnly={editInstanceOnly}
        setEditInstanceOnly={setEditInstanceOnly}
        displayForm={true}
        setDisplayForm={setDisplayForm}
        todo={todoItem}
      />
    );

  return (
    <>
      <div
        onDoubleClick={() => setDisplayForm(true)}
        ref={setNodeRef}
        style={style}
        className={clsx(
          " touch-none max-w-full min-h-11 relative flex justify-between items-center bg-inherit pt-4  rounded-md",
          isGrabbing
            ? "shadow-[0px_10px_30px_rgba(6,8,30,0.3)] z-30  brightness-110"
            : "shadow-none",
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...attributes}
        {...listeners}
        onMouseOver={() => setShowHandle(true)}
        onMouseOut={() => setShowHandle(false)}
        onMouseDown={() => setGrabbing(true)}
        onMouseUp={() => setGrabbing(false)}
      >
        <div
          {...attributes}
          {...listeners}
          className={clsx(
            "cursor-grabbing absolute -left-5 sm:-left-7 bottom-1/2 translate-y-1/2 text-muted-foreground p-1",
            showHandle === true ? "text-card-foreground" : "text-transparent",
          )}
        >
          <GripVertical className="w-4 h-4 hover:text-foreground" />
        </div>

        <div className="flex items-start gap-3">
          <TodoCheckbox
            icon={Check}
            priority={priority}
            complete={completed}
            onChange={() => {
              completeMutateFn(todoItem);
            }}
            checked={completed}
            variant={rrule ? "repeat" : "outline"}
          />

          <div className=" max-w-full pl-2 sm:pl-0">
            <p className="leading-none select-none mb-2 text-foreground ">
              {title}
            </p>

            <pre className="pb-2 text-muted-foreground text-xs sm:text-sm whitespace-pre-wrap w-48 sm:w-full">
              {description}
            </pre>
            <div className="flex items-center justify-start gap-2">

              <p className={clsx(overdue ? "text-orange" : "text-lime")}>{getDisplayDate(dtstart, true, locale)}</p>
              {todoItem.projectID && <p className='py-[0.2rem] px-2 rounded-full bg-border'><span className="text-lime">#</span> {projectMetaData[todoItem.projectID]?.name}</p>}
              {overdue && <p className='py-[0.2rem] px-2 rounded-full bg-border'>overdue</p>}
            </div>

          </div>
        </div>

        <TodoItemMenuContainer
          className={clsx(
            "flex items-center gap-2",
            !showHandle && "opacity-0",
          )}
          todo={todoItem}
          setDisplayForm={setDisplayForm}
          setEditInstanceOnly={setEditInstanceOnly}
        />
      </div>
      <LineSeparator className="" />
    </>
  );
};

