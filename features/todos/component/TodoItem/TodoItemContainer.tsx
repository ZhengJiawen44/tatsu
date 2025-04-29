import { useEffect, useState } from "react";
import TodoItemMenuContainer from "./TodoMenu/TodoItemMenuContainer";
import TodoFormContainer from "./TodoForm/TodoFormContainer";
import TodoCheckbox from "@/components/ui/TodoCheckbox";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoItemType } from "@/types";
import GripVertical from "@/components/ui/icon/gripVertical";
import { useCompleteTodo } from "../../api/complete-todo";
import { useTodoForm } from "@/providers/TodoFormProvider";

export const TodoItemContainer = ({
  todoItem,
  variant = "DEFAULT",
}: {
  todoItem: TodoItemType;
  variant?: "DEFAULT" | "completed-todos";
}) => {
  //dnd kit setups
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { title, description, completed, priority } = todoItem;

  const { displayForm, setDisplayForm } = useTodoForm();
  const [showHandle, setShowHandle] = useState(false);

  const [isGrabbing, setGrabbing] = useState(false);

  const { mutateCompleted } = useCompleteTodo(todoItem);

  useEffect(() => {
    if (!displayForm) {
      setShowHandle(false);
    }
  }, [displayForm]);

  if (displayForm)
    return (
      <TodoFormContainer
        displayForm={true}
        setDisplayForm={setDisplayForm}
        todo={todoItem}
      />
    );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          "border w-full min-h-11 relative flex justify-between items-center my-4 bg-inherit py-2 rounded-md",
          isGrabbing && variant === "DEFAULT"
            ? "shadow-[0px_10px_30px_rgba(6,8,30,0.3)] z-30 border border-border-muted"
            : "shadow-none"
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...attributes}
        {...listeners}
        onMouseEnter={() => setShowHandle(true)}
        onMouseLeave={() => setShowHandle(false)}
        onMouseDown={() => setGrabbing(true)}
        onMouseUp={() => setGrabbing(false)}
      >
        <div
          {...attributes}
          {...listeners}
          className={clsx(
            "cursor-grabbing absolute -left-7 top-2",
            showHandle === true ? "text-card-foreground" : "text-transparent",
            variant === "completed-todos" && "hidden"
          )}
        >
          <GripVertical className=" w-5 h-5 " />
        </div>

        <div className="w-full">
          <div className="flex items-start gap-3">
            <TodoCheckbox
              priority={priority}
              complete={completed}
              onChange={() => {
                mutateCompleted();
              }}
              checked={completed}
            />
            <div className="w-full">
              <p className="leading-none select-none text-card-foreground mb-1 text-sm">
                {title}
              </p>

              <pre className="text-card-foreground-muted text-sm flex whitespace-pre-wrap">
                {description}
              </pre>
            </div>
          </div>
        </div>

        {variant === "DEFAULT" && (
          <TodoItemMenuContainer
            className={clsx(
              "flex items-center gap-2",
              !showHandle && "opacity-0"
            )}
          />
        )}
      </div>
    </>
  );
};
