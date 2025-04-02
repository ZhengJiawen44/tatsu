import Unpin from "@/components/ui/icon/unpin";
import LineSeparator from "@/components/ui/lineSeparator";
import {
  MenuContainer,
  MenuItem,
  MenuTrigger,
  MenuContent,
} from "@/components/ui/Menu";
import Spinner from "@/components/ui/spinner";
import { useDeleteTodo } from "@/features/todos/api/delete-todo";
import { usePinTodo } from "@/features/todos/api/pin-todo";
import { usePrioritizeTodo } from "@/features/todos/api/prioritize-todo";
import { useTodoMenu } from "@/providers/TodoMenuProvider";
import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import { PriorityIndicator } from "../PriorityIndicator";
import Meatball from "@/components/ui/icon/meatball";

function TodoItemMeatballMenu() {
  const { todoItem, setDisplayForm, setShowContent, showContent } =
    useTodoMenu();
  const { mutatePrioritize } = usePrioritizeTodo(todoItem);

  const { deleteMutate, deletePending } = useDeleteTodo();
  const { pinMutate } = usePinTodo(todoItem);
  return (
    <MenuContainer setShowContent={setShowContent} showContent={showContent}>
      <MenuTrigger>
        <Meatball className="w-5 h-5" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => pinMutate()}>
          {!todoItem.pinned ? (
            <Pin className="w-4 h-4" />
          ) : (
            <Unpin className="w-4 h-4" />
          )}
          {todoItem.pinned ? "unpin" : "Pin to top"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDisplayForm((prev: boolean) => !prev);
            setShowContent(false);
          }}
        >
          <Edit className="w-4 h-4" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => deleteMutate({ id: todoItem.id })}>
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
              mutatePrioritize({ level: "Low" });
              setShowContent(false);
            }}
          />
          <PriorityIndicator
            level={2}
            onClick={() => {
              mutatePrioritize({ level: "Medium" });
              setShowContent(false);
            }}
          />
          <PriorityIndicator
            level={3}
            onClick={() => {
              mutatePrioritize({ level: "High" });
              setShowContent(false);
            }}
          />
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
}

export default TodoItemMeatballMenu;
