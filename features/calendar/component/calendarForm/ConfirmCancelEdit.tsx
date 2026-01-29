import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";

type confirmCancelEditProp = {
  cancelEditDialogOpen: boolean;
  setCancelEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmCancelEdit({
  cancelEditDialogOpen,
  setCancelEditDialogOpen,
  setDisplayForm,
}: confirmCancelEditProp) {
  const modalDict = useTranslations("modal");

  if (!cancelEditDialogOpen) return null;

  return (
    <Modal open={cancelEditDialogOpen} onOpenChange={setCancelEditDialogOpen}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{modalDict("cancelEdit.title")}</ModalTitle>
            <ModalDescription>
              {modalDict("cancelEdit.subtitle")}
            </ModalDescription>
          </ModalHeader>

          <ModalFooter className="mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-popover"
              onClick={() => setCancelEditDialogOpen(false)}
              onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
            >
              {modalDict("cancel")}
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
              onClick={() => {
                setCancelEditDialogOpen(false);
                setDisplayForm(false);
              }}
            >
              {modalDict("confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}