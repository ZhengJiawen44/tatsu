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
// import { useDeleteCalendarTodo } from "../../api/delete-calendar-todo";
// import { useDeleteCalendarInstanceTodo } from "../../api/delete-calendar-instance-todo";
import { CalendarTodoItemType } from "@/types";

type ConfirmEditAllProp = {
  //   formProps: {
  //     title: CalendarTodoItemType["title"];
  //     description: CalendarTodoItemType["description"];
  //     priority: CalendarTodoItemType["priority"];
  //     dtstart: CalendarTodoItemType["dtstart"];
  //     due: CalendarTodoItemType["due"];
  //     rrule: CalendarTodoItemType["rrule"];
  //   };
  todo: CalendarTodoItemType;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  editAllDialogOpen: boolean;
  setEditAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmEditAll({
  todo,
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
              editCalendarTodo(todo);
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
