import React from "react";
import Pin from "../ui/icon/pin";
import Edit from "../ui/icon/edit";
import Trash from "../ui/icon/trash";
import { MeatballMenu, MenuItem } from "../MeatballMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { useToast } from "@/hooks/use-toast";
const TodoItemMenu = ({
  id,
  setDisplayForm,
}: {
  id: string;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteTodo,
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  return (
    <MeatballMenu>
      <MenuItem>
        <Pin className="w-4 h-4" />
        Pin to top
      </MenuItem>
      <MenuItem
        onClick={() => {
          setDisplayForm((prev: boolean) => !prev);
        }}
      >
        <Edit className="w-4 h-4" />
        Edit
      </MenuItem>
      <MenuItem onClick={mutate}>
        {isPending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <Trash className="w-4 h-4" />
        )}
        delete
      </MenuItem>
    </MeatballMenu>
  );
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
