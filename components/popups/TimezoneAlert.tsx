"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useUserTimezone } from "@/features/user/query/get-timezone";
import { useState } from "react";

export const TimezoneAlert = () => {
  const { userTimezone } = useUserTimezone();
  const [showDialog, setShowDialog] = useState(!Boolean(userTimezone));

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="border-0 outline-0 pb-10">
        <DialogHeader>
          <DialogTitle className="text-2xl">Alert</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            we could not get your timezone, this could be an issue on our part.
          </p>
          <br />
          <p>
            For best user experience, please manually set your
            timezone in the user menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
