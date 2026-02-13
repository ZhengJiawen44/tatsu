import React from "react";
import { useEditCalendarTodo } from "@/features/calendar/query/update-calendar-todo";
import { useEditCalendarTodoInstance } from "@/features/calendar/query/update-calendar-todo-instance";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";

type ConfirmEditAllDialogProp = {
  todo: TodoItemType;
  rruleChecksum: string;
  dateRangeChecksum: string;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  editAllDialogOpen: boolean;
  setEditAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmEditAllDialog({
  todo,
  rruleChecksum,
  dateRangeChecksum,
  setDisplayForm,
  editAllDialogOpen,
  setEditAllDialogOpen,
}: ConfirmEditAllDialogProp) {
  const modalDict = useTranslations("modal");
  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();

  if (!editAllDialogOpen) return null;

  return (
    <Modal open={editAllDialogOpen} onOpenChange={setEditAllDialogOpen}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{modalDict("editAll.title")}</ModalTitle>
            <ModalDescription>{modalDict("editAll.subtitle")}</ModalDescription>
          </ModalHeader>

          <ModalFooter className="mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                editCalendarTodoInstance(todo);
                setEditAllDialogOpen(false);
                setDisplayForm(false);
              }}
            >
              {modalDict("editAll.editInstance")}
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
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
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}