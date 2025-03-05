import { useState } from "react";
import TodoItemMenu from "./TodoItemMenu";
import TodoForm from "./TodoForm";
import TodoCheckbox from "../ui/TodoCheckbox";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoItemType } from "@/types";
import GripVertical from "../ui/icon/gripVertical";

export const TodoItem = ({
  todoItem,
  variant = "DEFAULT",
}: {
  todoItem: TodoItemType;
  variant?: "DEFAULT" | "completed-todos";
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const queryClient = useQueryClient();
  const { id, title, description, pinned, completed } = todoItem;
  const [isEdit, setEdit] = useState(false);
  const [todoCompleted, setCompleted] = useState(completed);

  const [showHandle, setShowHandle] = useState(false);

  async function completeTodo() {
    await fetch(`/api/todo/${id}?completed=${todoCompleted}`, {
      method: "PATCH",
    });
  }

  const { mutate: mutateCompleted } = useMutation({
    mutationFn: completeTodo,
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  if (isEdit) {
    return (
      <TodoForm
        displayForm={true}
        setDisplayForm={setEdit}
        todo={{ id, title, description }}
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex justify-between items-start my-10 h-fit"
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...attributes}
        {...listeners}
        onMouseEnter={() => setShowHandle(true)}
        onMouseLeave={() => setShowHandle(false)}
      >
        <div
          {...attributes}
          {...listeners}
          className={clsx(
            "cursor-grabbing absolute -left-7 px-1 pb-2 -top-1",
            showHandle === true ? "text-card-foreground" : "text-transparent"
          )}
          onMouseEnter={() => setShowHandle(true)}
          onMouseLeave={() => setShowHandle(false)}
        >
          <GripVertical className=" w-5 h-5 " />
        </div>
        <div>
          <div className="flex items-start gap-3 ">
            <TodoCheckbox
              onChange={() => {
                setCompleted(!completed);
                mutateCompleted();
              }}
              checked={todoCompleted}
            />
            <div>
              <p className="leading-none select-none text-card-foreground mb-1">
                {title}
              </p>
              <p className="text-card-foreground-muted ">{description}</p>
            </div>
          </div>
        </div>

        <TodoItemMenu
          id={id}
          setDisplayForm={setEdit}
          pinned={pinned}
          className={clsx(variant === "DEFAULT" ? "" : "hidden")}
        />
      </div>
    </>
  );
};
