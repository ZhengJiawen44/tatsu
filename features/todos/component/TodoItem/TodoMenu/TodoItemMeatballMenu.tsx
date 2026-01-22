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
import { SquarePen } from "lucide-react";
import { Blocks } from "lucide-react";
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
      <DropdownMenuContent className="bg-popover py-1 px-0">
        <DropdownMenuItem className="m-1" onClick={() => pinMutate()}>
          {!todo.pinned ? (
            <Pin className="w-4 h-4" />
          ) : (
            <Unpin className="w-4 h-4" />
          )}
          {todo.pinned ? "unpin" : "Pin to top"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="m-1"
          onClick={() => {
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <SquarePen className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="m-1"
          onClick={() => {
            setEditInstanceOnly(true);
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <Blocks className="w-4 h-4" />
          Edit as Instance
        </DropdownMenuItem>
        <DropdownMenuItem
          className="m-1"
          onClick={() => deleteMutate({ id: todo.id })}
        >
          {deletePending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
          delete
        </DropdownMenuItem>
        <LineSeparator className="border-popover-accent w-full" />

        <DropdownMenuItem
          className="flex-col items-start hover:bg-transparent text-xs gap-4 pb-4"
          onClick={() => {}}
        >
          <p className="text-sm font-semibold text-card-foreground-muted ">
            priority
          </p>
          <div className="flex gap-4 items-center pl-2">
            <PriorityIndicator
              isSelected={todo.priority == "Low"}
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
              isSelected={todo.priority == "Medium"}
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
              isSelected={todo.priority == "High"}
              level={3}
              onClick={() => {
                mutatePrioritize({
                  id: todo.id,
                  level: "High",
                  isRecurring: todo.rrule ? true : false,
                });
              }}
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodoItemMeatballMenu;
