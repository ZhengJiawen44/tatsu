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
import LineSeparator from "@/components/ui/lineSeparator";
import { getDisplayDate } from "@/lib/date/displayDate";
import { useLocale } from "next-intl";
import { useTodoMutation } from "@/providers/TodoMutationProvider";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import ProjectTag from "@/components/ProjectTag";
import TodoItemMenuContainer from "./TodoItem/TodoMenu/TodoItemMenuContainer";

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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todoItem.id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const { title, description, completed, priority, rrule, dtstart } = todoItem;
  const [displayForm, setDisplayForm] = useState(false);
  const [editInstanceOnly, setEditInstanceOnly] = useState(false);
  const [showHandle, setShowHandle] = useState(false);


  useEffect(() => {
    if (!displayForm) {
      setShowHandle(false);
    }
  }, [displayForm]);


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
        onTouchMove={(e) => { e.stopPropagation(); e.preventDefault() }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={() => setDisplayForm(true)}
        onMouseOver={() => setShowHandle(true)}
        onMouseOut={() => setShowHandle(false)}
        className={clsx(
          "max-w-full min-h-11 relative border border-black/0 bg-inherit flex justify-between items-center  pt-4 rounded-md cursor-grab active:cursor-grabbing",
          isDragging
            ? "backdrop-blur-sm border border-white/20 shadow-2xl touch-manipulation  z-30 brightness-110 opacity-80"
            : "shadow-none",
        )}
      >
        <div
          className={clsx(
            "hidden sm:block absolute -left-5 sm:-left-7 bottom-1/2 translate-y-1/2 p-1 transition-colors",
            showHandle ? "text-card-foreground" : "text-transparent",
          )}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex items-start gap-3">
          <div>
            <TodoCheckbox
              icon={Check}
              priority={priority}
              complete={completed}
              onChange={() => completeMutateFn(todoItem)}
              checked={completed}
              variant={rrule ? "repeat" : "outline-solid"}
            />
          </div>

          <div className="max-w-full pl-2 sm:pl-0">
            <p className="leading-none select-none mb-2 text-foreground">
              {title}
            </p>
            <pre className="pb-2 text-muted-foreground text-xs sm:text-sm whitespace-pre-wrap w-48 sm:w-full">
              {description}
            </pre>
            <div className="flex flex-wrap items-center justify-start gap-2">
              <p className={clsx(overdue ? "text-orange" : "text-lime")}>
                {getDisplayDate(dtstart, true, locale)}
              </p>
              {todoItem.projectID &&
                <p className='flex items-center py-[0.2rem] px-2 rounded-full border bg-sidebar gap-1'>
                  <ProjectTag id={todoItem.projectID} className="text-sm shrink-0" />
                  <span className="truncate max-w-14 sm:max-w-24 md:max-w-52 lg:max-w-none">
                    {projectMetaData[todoItem.projectID]?.name}
                  </span>
                </p>
              }
              {overdue && <p className='py-[0.2rem] px-2 rounded-full bg-sidebar border'>overdue</p>}
            </div>
          </div>
        </div>

        <div>
          <TodoItemMenuContainer
            displayMenu={showHandle}
            className={clsx("flex items-center gap-2", !showHandle && "opacity-0")}
            todo={todoItem}
            setDisplayForm={setDisplayForm}
            setEditInstanceOnly={setEditInstanceOnly}
          />
        </div>
      </div>
      <LineSeparator />
    </>
  );

};

