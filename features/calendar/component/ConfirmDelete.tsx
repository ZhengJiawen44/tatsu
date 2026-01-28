import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useDeleteCalendarTodo } from "../query/delete-calendar-todo";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type confirmDeleteProp = {
  todo: TodoItemType;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmDelete({
  todo,
  deleteDialogOpen,
  setDeleteDialogOpen,
}: confirmDeleteProp) {
  const modalDict = useTranslations("modal");
  const { deleteMutate } = useDeleteCalendarTodo();

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover"
        onMouseDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{modalDict("delete.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {modalDict("delete.subtitle")}{" "}
          <span className="font-semibold">{todo.title}</span>
        </p>
        <DialogFooter className="mt-4">
          <Button
            variant={"outline"}
            className="bg-popover"
            onClick={() => setDeleteDialogOpen(false)}
          >
            {modalDict("cancel")}
          </Button>
          <Button
            variant={"destructive"}
            className=""
            onClick={() => {
              deleteMutate(todo);
              setDeleteDialogOpen(false);
            }}
          >
            {modalDict("delete.button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}