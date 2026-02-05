import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer";

type ConfirmCancelEditDrawerProp = {
    cancelEditDialogOpen: boolean;
    setCancelEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmCancelEditDrawer({
    cancelEditDialogOpen,
    setCancelEditDialogOpen,
    setDisplayForm,
}: ConfirmCancelEditDrawerProp) {
    const modalDict = useTranslations("modal");

    return (
        <Drawer open={cancelEditDialogOpen} onOpenChange={setCancelEditDialogOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{modalDict("cancelEdit.title")}</DrawerTitle>
                    <DrawerDescription>
                        {modalDict("cancelEdit.subtitle")}
                    </DrawerDescription>
                </DrawerHeader>

                <DrawerFooter className="gap-2">
                    <Button
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                        variant="outline"
                        className="w-full bg-popover"
                        onClick={() => setCancelEditDialogOpen(false)}
                    >
                        {modalDict("cancel")}
                    </Button>

                    <Button
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}

                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                            setCancelEditDialogOpen(false);
                            setDisplayForm(false);
                        }}
                    >
                        {modalDict("confirm")}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
