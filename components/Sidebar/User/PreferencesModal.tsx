"use client";
import { SetStateAction, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
} from "@/components/ui/Modal";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function PreferencesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { updatePreferences, preferences, isPending } = useUserPreferences();
  const [showOverdue, setShowOverdue] = useState(
    preferences?.showOverdue != false,
  );
  const [showUpcoming, setShowUpcoming] = useState(
    preferences?.showUpcoming != false,
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalOverlay>
        <ModalContent className="max-w-xl px-0">
          <ModalHeader className="relative mx-auto">
            <ModalTitle className="text-lg w-2/3 mx-auto">
              <p className="m-auto w-fit">Preferences</p>
            </ModalTitle>
            <ModalClose className="absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground hover:text-foreground">
              <X />
            </ModalClose>
          </ModalHeader>
          <ModalBody className="pb-0!">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePreferences({
                  ...(showOverdue != null && { showOverdue }),
                  ...(showUpcoming != null && { showUpcoming }),
                });
                router.refresh();
              }}
            >
              <h3 className="text-base">Show overdue</h3>
              <div className="flex justify-between">
                <p className="max-w-3/4 text-sm text-muted-foreground">
                  Displays an overdue section in your today page
                </p>
                <Switch
                  checked={showOverdue}
                  onCheckedChange={setShowOverdue}
                />
              </div>
              <br />
              <h3 className="text-base">Show upcoming</h3>
              <div className="flex justify-between">
                <p className="max-w-3/4 text-sm text-muted-foreground">
                  Displays an upcoming section in your today page
                </p>
                <Switch
                  checked={showUpcoming}
                  onCheckedChange={setShowUpcoming}
                />
              </div>

              <div className="flex w-full justify-between pt-20">
                {isPending && <Spinner />}
                <div className="w-fit ml-auto flex gap-2 ">
                  <Button variant="destructive">Cancel</Button>
                  <Button variant="outline">Save</Button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
