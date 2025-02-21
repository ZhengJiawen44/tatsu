import { useState } from "react";
import TodoItemMenu from "./TodoItemMenu";
import TodoForm from "./TodoForm";
import TodoCheckbox from "../ui/TodoCheckbox";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  completed: boolean;
}

export const TodoItem = ({
  todoItem,
  variant = "DEFAULT",
}: {
  todoItem: TodoItem;
  variant?: "DEFAULT" | "completed-todos";
}) => {
  const queryClient = useQueryClient();
  const { id, title, description, pinned, completed } = todoItem;
  const [isEdit, setEdit] = useState(false);
  const [todoCompleted, setCompleted] = useState(completed);

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
      <div className="flex justify-between items-center my-10">
        <div>
          <div className="flex items-start gap-3">
            <TodoCheckbox
              onChange={(e) => {
                setCompleted(!completed);
                mutateCompleted();
              }}
              checked={todoCompleted}
            />
            <p className="text-card-foreground text-[1rem]">{title}</p>
          </div>
          <p className="text-card-foreground-muted text-[0.9rem] ml-10">
            {description}
          </p>
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
