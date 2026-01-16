import Unpin from "@/components/ui/icon/unpin";
import LineSeparator from "@/components/ui/lineSeparator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import { useDeleteTodo } from "@/features/todos/query/delete-todo";
import { usePinTodo } from "@/features/todos/query/pin-todo";
import { usePrioritizeTodo } from "@/features/todos/query/prioritize-todo";
import Pin from "@/components/ui/icon/pin";
import { LuSquarePen } from "react-icons/lu";
import { LuBlocks } from "react-icons/lu";
import Trash from "@/components/ui/icon/trash";
import { PriorityIndicator } from "../PriorityIndicator";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import Meatball from "@/components/ui/icon/meatball";

function TodoItemMeatballMenu({
  todo,
  setDisplayForm,
  setEditInstanceOnly,
}: {
  todo: TodoItemType;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutatePrioritize } = usePrioritizeTodo();

  const { deleteMutate, deletePending } = useDeleteTodo();
  const { pinMutate } = usePinTodo(todo);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="border-none text-muted-foreground"
        >
          <Meatball className="w-[1.1rem] h-[1.1rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => pinMutate()}>
          {!todo.pinned ? (
            <Pin className="w-4 h-4" />
          ) : (
            <Unpin className="w-4 h-4" />
          )}
          {todo.pinned ? "unpin" : "Pin to top"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <LuSquarePen className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setEditInstanceOnly(true);
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <LuBlocks className="w-4 h-4" />
          Edit as Instance
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteMutate({ id: todo.id })}>
          {deletePending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
          delete
        </DropdownMenuItem>
        <LineSeparator className="border-card-foreground-muted my-2 w-[95%]" />
        <p className="text-sm text-card-foreground-muted ">priority</p>
        <DropdownMenuItem
          className="flex w-full px-2 hover:bg-transparent gap-4 text-xs"
          onClick={() => {}}
        >
          <PriorityIndicator
            level={1}
            onClick={() => {
              mutatePrioritize({
                id: todo.id,
                level: "Low",
                isRecurring: todo.rrule ? true : false,
              });
            }}
          />
          <PriorityIndicator
            level={2}
            onClick={() => {
              mutatePrioritize({
                id: todo.id,
                level: "Medium",
                isRecurring: todo.rrule ? true : false,
              });
            }}
          />
          <PriorityIndicator
            level={3}
            onClick={() => {
              mutatePrioritize({
                id: todo.id,
                level: "High",
                isRecurring: todo.rrule ? true : false,
              });
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodoItemMeatballMenu;
