import React, { useRef } from "react";
import Pin from "@/components/ui/icon/pin";
import Unpin from "@/components/ui/icon/unpin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import { MeatballMenu, MenuItem } from "@/components/ui/MeatballMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
import clsx from "clsx";

const TodoItemMenu = ({
  className,
  id,
  setDisplayForm,
  pinned,
  contentVisible,
  setContentVisible,
  ...props
}: {
  className?: string;
  id: string;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  pinned: boolean;
  contentVisible: boolean;
  setContentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: deleteTodo,
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  const { mutate: pinMutate, isPending: pinPending } = useMutation({
    mutationFn: pinned ? unpinTodo : pinTodo,
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  return (
    <div
      ref={menuRef}
      className={className}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      {...props}
    >
      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Pin className="w-[17px] h-[17px]" />
      </div>

      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Edit className="w-[17px] h-[17px]" />
      </div>
      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Trash className="w-[17px] h-[17px]" />
      </div>

      <MeatballMenu
        className="flex"
        contentVisible={contentVisible}
        setContentVisible={setContentVisible}
      >
        <MenuItem onClick={() => pinMutate()}>
          {pinPending ? (
            <Spinner className="w-4 h-4" />
          ) : !pinned ? (
            <Pin className="w-4 h-4" />
          ) : (
            <Unpin className="w-4 h-4" />
          )}
          {pinned ? "unpin" : "Pin to top"}
        </MenuItem>
        <MenuItem onClick={() => setDisplayForm((prev: boolean) => !prev)}>
          <Edit className="w-4 h-4" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => deleteMutate()}>
          {deletePending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
          delete
        </MenuItem>
        <LineSeparator className="border-card-foreground-muted my-2 w-[95%]" />
        <p className="text-sm text-card-foreground-muted ">priority</p>
        <MenuItem className="flex w-full px-2 hover:bg-transparent gap-1 text-sm">
          <div className="hover:bg-card p-2 rounded-md">
            <div className="w-6 h-6 border-2 border-lime rounded-md flex justify-center items-center ">
              1
            </div>
          </div>

          <div className="hover:bg-card p-2 rounded-md">
            <div className="w-6 h-6 border-2 border-yellow-500 rounded-md flex justify-center items-center ">
              2
            </div>
          </div>
          <div className="hover:bg-card p-2 rounded-md">
            <div className="w-6 h-6 border-2 border-orange-700 rounded-md flex justify-center items-center ">
              3
            </div>
          </div>
        </MenuItem>
      </MeatballMenu>
    </div>
  );

  async function pinTodo() {
    await fetch(`/api/todo/${id}?pin=true`, { method: "PATCH" });
  }
  async function unpinTodo() {
    await fetch(`/api/todo/${id}?pin=false`, { method: "PATCH" });
  }
  async function deleteTodo() {
    try {
      const res = await fetch(`/api/todo/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: "Something went wrong",
        }));
        throw new Error(errorData.message);
      }

      // Parse JSON response
      const { message } = await res.json();
      toast({ description: message });
    } catch (error) {
      console.error("Delete Todo Error:", error);
      toast({
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }
};

export default TodoItemMenu;
