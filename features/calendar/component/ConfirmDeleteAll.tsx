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
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type ConfirmDeleteAllProp = {
  todo: TodoItemType;
  deleteAllDialogOpen: boolean;
  setDeleteAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmDeleteAll({
  todo,
  deleteAllDialogOpen,
  setDeleteAllDialogOpen,
}: ConfirmDeleteAllProp) {
  const modalDict = useTranslations("modal");
  const { deleteMutate } = useDeleteCalendarTodo();
  const { deleteInstanceMutate } = useDeleteCalendarInstanceTodo();

  return (
    <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover">
        <DialogHeader>
          <DialogTitle>{modalDict("deleteAll.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {modalDict("deleteAll.subtitle")}
        </p>
        <DialogFooter className="mt-4">
          <Button
            variant={"outline"}
            className="bg-popover"
            onClick={() => {
              deleteInstanceMutate(todo);
              setDeleteAllDialogOpen(false);
            }}
          >
            {modalDict("deleteAll.deleteInstance")}
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteMutate(todo);
              setDeleteAllDialogOpen(false);
            }}
          >
            {modalDict("deleteAll.deleteAll")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}