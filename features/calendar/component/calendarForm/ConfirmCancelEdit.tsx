import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useTranslations } from "next-intl";

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

  return (
    <Dialog open={cancelEditDialogOpen} onOpenChange={setCancelEditDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover"
        onMouseDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{modalDict("cancelEdit.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {modalDict("cancelEdit.subtitle")}
        </p>
        <DialogFooter className="mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => setCancelEditDialogOpen(false)}
          >
            {modalDict("cancel")}
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red text-white hover:bg-red"
            onClick={() => {
              setCancelEditDialogOpen(false);
              setDisplayForm(false);
            }}
          >
            {modalDict("confirm")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}