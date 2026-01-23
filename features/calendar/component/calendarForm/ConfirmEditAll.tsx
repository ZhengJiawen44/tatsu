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
import { useTranslations } from "next-intl";

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
  const modalDict = useTranslations("modal");
  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();

  return (
    <Dialog open={editAllDialogOpen} onOpenChange={setEditAllDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover">
        <DialogHeader>
          <DialogTitle>{modalDict("editAll.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {modalDict("editAll.subtitle")}
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
            {modalDict("editAll.editInstance")}
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
            {modalDict("editAll.editAll")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}