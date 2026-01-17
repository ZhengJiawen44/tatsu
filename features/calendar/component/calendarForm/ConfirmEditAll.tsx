import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useEditCalendarTodo } from "../../query/update-calendar-todo";
import { useEditCalendarTodoInstance } from "../../query/update-calendar-todo-instance";
import { CalendarTodoItemType } from "@/types";

type ConfirmEditAllProp = {
  todo: CalendarTodoItemType;
  rruleChecksum: string;
  dateRangeChecksum: string;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  editAllDialogOpen: boolean;
  setEditAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmEditAll({
  todo,
  rruleChecksum,
  dateRangeChecksum,
  setDisplayForm,
  editAllDialogOpen,
  setEditAllDialogOpen,
}: ConfirmEditAllProp) {
  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();
  return (
    <Dialog open={editAllDialogOpen} onOpenChange={setEditAllDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover">
        <DialogHeader>
          <DialogTitle>Edit all todo recurrences?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This is an recurring todo, make the same edit for all other
          recurrences?
        </p>

        <DialogFooter className="mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => {
              editCalendarTodoInstance(todo);
              setEditAllDialogOpen(false);
              setDisplayForm(false);
            }}
          >
            Edit this occurence only
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red text-white hover:bg-red"
            onClick={() => {
              editCalendarTodo({
                ...todo,
                dateRangeChecksum: dateRangeChecksum,
                rruleChecksum: rruleChecksum,
              });
              setEditAllDialogOpen(false);
              setDisplayForm(false);
            }}
          >
            Edit all recurrences
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
