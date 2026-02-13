import { Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalTitle, ModalDescription } from "@/components/ui/Modal";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

type confirmDeleteProp = {
  logoutModalOpen: boolean;
  setLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ConfirmLogoutModal({
  logoutModalOpen,
  setLogoutModalOpen,
}: confirmDeleteProp) {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" });
  };
  return (
    <Modal
      open={logoutModalOpen}
      onOpenChange={setLogoutModalOpen}
    >
      <ModalOverlay>
        <ModalContent className="w-fit min-w-0 top-1/2 -translate-y-1/2 ">
          <ModalHeader>
            <ModalTitle>Logout</ModalTitle>
            <ModalDescription>
              Are you sure you would like to Log out of your account?
            </ModalDescription>
          </ModalHeader>


          <ModalFooter className="mt-4">
            <Button
              variant={"outline"}
              className="bg-lime/80 h-fit! text-white py-1.5! hover:bg-lime"
              onClick={() => setLogoutModalOpen(false)}
            >
              No
            </Button>
            <Button
              variant={"outline"}
              className="bg-inherit h-fit! py-1.5!"
              onClick={() => {
                setLogoutModalOpen(false);

                handleLogout();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>

    </Modal>
  );
}
