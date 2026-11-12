import { SetStateAction } from "react";
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

export default function PreferencesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
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
          <ModalBody>
            <h3 className="text-base">Show overdue</h3>
            <div className="flex justify-between">
              <p className="max-w-3/4 text-sm text-muted-foreground">
                Displays an overdue section in your today page
              </p>
              <Switch />
            </div>

            <br />
            <h3 className="text-base">Show upcoming</h3>
            <div className="flex justify-between">
              <p className="max-w-3/4 text-sm text-muted-foreground">
                Displays an upcoming section in your today page
              </p>
              <Switch />
            </div>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
