import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import React from "react";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useDeleteTodo } from "@/features/todos/api/delete-todo";
import { usePinTodo } from "@/features/todos/api/pin-todo";
import Spinner from "@/components/ui/spinner";
import { TodoItemType } from "@/types";

const TodoItemSideMenu = ({
  todo,
  setDisplayForm,
}: {
  todo: TodoItemType;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { deleteMutate, deletePending } = useDeleteTodo();
  const { pinMutate } = usePinTodo(todo);
  return (
    <div className="hidden sm:flex items-center gap-2">
      <div
        className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md"
        onClick={() => {
          pinMutate();
        }}
      >
        <Pin className="w-[17px] h-[17px]" />
      </div>

      <div
        className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md"
        onClick={() => setDisplayForm(true)}
      >
        <Edit className="w-[17px] h-[17px]" />
      </div>
      <div
        className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md"
        onClick={() => {
          deleteMutate({ id: todo.id });
        }}
      >
        {deletePending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <Trash className="w-[17px] h-[17px]" />
        )}
      </div>
    </div>
  );
};

export default TodoItemSideMenu;
