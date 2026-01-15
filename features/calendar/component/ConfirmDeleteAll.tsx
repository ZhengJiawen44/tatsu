import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useDeleteCalendarTodo } from "../query/delete-calendar-todo";
import { useDeleteCalendarInstanceTodo } from "../query/delete-calendar-instance-todo";
import { CalendarTodoItemType } from "@/types";

type ConfirmDeleteAllProp = {
  todo: CalendarTodoItemType;
  deleteAllDialogOpen: boolean;
  setDeleteAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmDeleteAll({
  todo,
  deleteAllDialogOpen,
  setDeleteAllDialogOpen,
}: ConfirmDeleteAllProp) {
  const { deleteMutate } = useDeleteCalendarTodo();
  const { deleteInstanceMutate } = useDeleteCalendarInstanceTodo();
  return (
    <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Delete all todo recurrences?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This is an recurring todo, delete all other recurrences?
        </p>

        <DialogFooter className="mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => {
              deleteInstanceMutate(todo);
              setDeleteAllDialogOpen(false);
            }}
          >
            Delete this occurence only
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red text-white hover:bg-red"
            onClick={() => {
              deleteMutate(todo);
              setDeleteAllDialogOpen(false);
            }}
          >
            Delete all recurrences
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
