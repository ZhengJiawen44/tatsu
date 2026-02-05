import React from "react";
import { useDeleteCalendarTodo } from "../../query/delete-calendar-todo";
import { useDeleteCalendarInstanceTodo } from "../../query/delete-calendar-instance-todo";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Modal, ModalOverlay, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/Modal";

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
  if (!deleteAllDialogOpen) return null
  return (
    <Modal open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {modalDict("deleteAll.title")}
            </ModalTitle>
            <ModalDescription>
              {modalDict("deleteAll.subtitle")}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              variant={"outline"}
              className="bg-popover min-w-0"
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
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}