import React from "react";
import Pin from "../ui/icon/pin";
import Unpin from "../ui/icon/unpin";
import Edit from "../ui/icon/edit";
import Trash from "../ui/icon/trash";

import { MeatballMenu, MenuItem } from "../ui/MeatballMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { useToast } from "@/hooks/use-toast";
const TodoItemMenu = ({
  className,
  id,
  setDisplayForm,
  pinned,
}: {
  className?: string;
  id: string;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  pinned: boolean;
}) => {
  const { toast } = useToast();
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
    <div className={className}>
      <MeatballMenu>
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
        <MenuItem
          onClick={() => {
            setDisplayForm((prev: boolean) => !prev);
          }}
        >
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
