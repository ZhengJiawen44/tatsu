import Unpin from "@/components/ui/icon/unpin";
import LineSeparator from "@/components/ui/lineSeparator";
import {
  MenuContainer,
  MenuItem,
  MenuTrigger,
  MenuContent,
} from "@/components/ui/Menu";
import Spinner from "@/components/ui/spinner";
import { useDeleteTodo } from "@/features/todos/query/delete-todo";
import { usePinTodo } from "@/features/todos/query/pin-todo";
import { usePrioritizeTodo } from "@/features/todos/query/prioritize-todo";
import Pin from "@/components/ui/icon/pin";
import { LuSquarePen } from "react-icons/lu";
import { LuBlocks } from "react-icons/lu";
import Trash from "@/components/ui/icon/trash";
import { PriorityIndicator } from "../PriorityIndicator";
import Meatball from "@/components/ui/icon/meatball";
import { TodoItemType } from "@/types";

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
    <MenuContainer>
      <MenuTrigger>
        <Meatball className="w-5 h-5" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => pinMutate()}>
          {!todo.pinned ? (
            <Pin className="w-4 h-4" />
          ) : (
            <Unpin className="w-4 h-4" />
          )}
          {todo.pinned ? "unpin" : "Pin to top"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <LuSquarePen className="w-4 h-4" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setEditInstanceOnly(true);
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
          <LuBlocks className="w-4 h-4" />
          Edit as Instance
        </MenuItem>
        <MenuItem onClick={() => deleteMutate({ id: todo.id })}>
          {deletePending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
          delete
        </MenuItem>
        <LineSeparator className="border-card-foreground-muted my-2 w-[95%]" />
        <p className="text-sm text-card-foreground-muted ">priority</p>
        <MenuItem
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
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
}

export default TodoItemMeatballMenu;
