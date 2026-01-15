import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useDeleteCalendarTodo } from "../query/delete-calendar-todo";
import { CalendarTodoItemType } from "@/types";

type confirmDeleteProp = {
  todo: CalendarTodoItemType;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmDelete({
  todo,
  deleteDialogOpen,
  setDeleteDialogOpen,
}: confirmDeleteProp) {
  const { deleteMutate } = useDeleteCalendarTodo();
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Delete todo?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete{" "}
          <span className="font-semibold">{todo.title}</span>
        </p>

        <DialogFooter className="mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red text-white hover:bg-red"
            onClick={() => {
              deleteMutate(todo);
              setDeleteDialogOpen(false);
            }}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
