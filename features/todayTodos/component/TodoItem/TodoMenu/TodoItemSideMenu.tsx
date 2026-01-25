import React from "react";
import { useDeleteTodo } from "@/features/todayTodos/query/delete-todo";
import { usePinTodo } from "@/features/todayTodos/query/pin-todo";
import Spinner from "@/components/ui/spinner";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";

import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";

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
    <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
      <Button
        variant={"outline"}
        size={"icon"}
        className="border-none"
        onClick={() => {
          pinMutate();
        }}
      >
        <Pin className="w-[1.1rem] h-[1.1rem]" />
      </Button>

      <Button
        variant={"outline"}
        size={"icon"}
        className="border-none"
        onClick={() => setDisplayForm(true)}
      >
        <Edit className="w-[1.1rem] h-[1.1rem] " />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="border-none"
        onClick={() => {
          deleteMutate({ id: todo.id });
        }}
      >
        {deletePending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <Trash className="w-[1.1rem] h-[1.1rem]" />
        )}
      </Button>
    </div>
  );
};

export default TodoItemSideMenu;
