import Unpin from "@/components/ui/icon/unpin";
import LineSeparator from "@/components/ui/lineSeparator";
import { MeatballMenu, MenuItem } from "@/components/ui/MeatballMenu";
import Spinner from "@/components/ui/spinner";
import { useDeleteTodo, usePinTodo } from "@/hooks/useTodo";
import { useTodoMenu } from "@/providers/TodoMenuProvider";
import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import { PriorityIndicator } from "../PriorityIndicator";

function TodoItemMeatballMenu() {
  const { deleteMutate, deletePending } = useDeleteTodo();
  const { pinMutate, pinPending } = usePinTodo();
  const { id, pinned, setDisplayForm, setShowContent, showContent } =
    useTodoMenu();
  return (
    <MeatballMenu
      className="flex"
      setShowContent={setShowContent}
      showContent={showContent}
    >
      <MenuItem onClick={() => pinMutate({ id, pin: !pinned })}>
        {pinPending ? (
          <Spinner className="w-4 h-4" />
        ) : !pinned ? (
          <Pin className="w-4 h-4" />
        ) : (
          <Unpin className="w-4 h-4" />
        )}
        {pinned ? "unpin" : "Pin to top"}
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
      <MenuItem onClick={() => deleteMutate({ id })}>
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
        <PriorityIndicator level={1} onClick={() => {}} />
        <PriorityIndicator level={2} onClick={() => {}} />
        <PriorityIndicator level={3} onClick={() => {}} />
      </MenuItem>
    </MeatballMenu>
  );
}

export default TodoItemMeatballMenu;
