import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

type confirmDeleteProp = {
  logoutDialogOpen: boolean;
  setLogoutDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmLogoutModal({
  logoutDialogOpen,
  setLogoutDialogOpen,
}: confirmDeleteProp) {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" });
  };
  return (
    <Dialog
      open={logoutDialogOpen}
      onOpenChange={setLogoutDialogOpen}
      defaultOpen={false}
    >
      <DialogContent className="max-w-sm top-1/2 -translate-y-1/2 bg-popover">
        <DialogHeader>
          <DialogTitle>Logout?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">Do you wish to logout? </p>

        <DialogFooter className="mt-4">
          <Button
            variant={"outline"}
            className="bg-primary"
            onClick={() => setLogoutDialogOpen(false)}
          >
            No
          </Button>
          <Button
            variant={"outline"}
            className=""
            onClick={() => {
              setLogoutDialogOpen(false);

              handleLogout();
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
