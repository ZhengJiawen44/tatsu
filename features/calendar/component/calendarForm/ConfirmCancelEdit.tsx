import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
// import { useDeleteCalendarTodo } from "../api/delete-calendar-todo";

type confirmCancelEditProp = {
  cancelEditDialogOpen: boolean;
  setCancelEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function confirmCancelEdit({
  cancelEditDialogOpen,
  setCancelEditDialogOpen,
  setDisplayForm,
}: confirmCancelEditProp) {
  //   const { deleteMutate } = useDeleteCalendarTodo();
  return (
    <Dialog open={cancelEditDialogOpen} onOpenChange={setCancelEditDialogOpen}>
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Cancel Edit?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          changes you have made will be discarded{" "}
        </p>

        <DialogFooter className="mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => setCancelEditDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red text-white hover:bg-red"
            onClick={() => {
              setCancelEditDialogOpen(false);
              setDisplayForm(false);
            }}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
