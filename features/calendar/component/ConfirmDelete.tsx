import React from "react";
import { useDeleteCalendarTodo } from "../query/delete-calendar-todo";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter
} from "@/components/ui/Modal";

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

  // Early return if not open, consistent with your ConfirmDeleteAll pattern
  if (!deleteDialogOpen) return null;

  return (
    <Modal open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{modalDict("delete.title")}</ModalTitle>
            <ModalDescription>
              {modalDict("delete.subtitle")}{" "}
              <span className="font-semibold text-foreground">{todo.title}</span>
            </ModalDescription>
          </ModalHeader>

          <ModalFooter className="mt-4">
            <Button
              variant={"outline"}
              className="bg-popover w-full sm:w-auto"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {modalDict("cancel")}
            </Button>
            <Button
              variant={"destructive"}
              className="w-full sm:w-auto"
              onClick={() => {
                deleteMutate(todo);
                setDeleteDialogOpen(false);
              }}
            >
              {modalDict("delete.button")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}