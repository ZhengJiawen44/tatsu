import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import React from "react";
import { useTodoMenu } from "@/providers/TodoMenuProvider";
import { useDeleteTodo, usePinTodo } from "@/hooks/useTodo";
import Spinner from "@/components/ui/spinner";

const TodoItemSideMenu = () => {
  const { id, pinned, setDisplayForm } = useTodoMenu();
  const { deleteMutate, deletePending } = useDeleteTodo();
  const { pinMutate, pinPending } = usePinTodo();
  return (
    <>
      <div
        className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md"
        onClick={() => {
          pinMutate({ id, pin: !pinned });
        }}
      >
        {pinPending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <Pin className="w-[17px] h-[17px]" />
        )}
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
          deleteMutate({ id });
        }}
      >
        {deletePending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <Trash className="w-[17px] h-[17px]" />
        )}
      </div>
    </>
  );
};

export default TodoItemSideMenu;
