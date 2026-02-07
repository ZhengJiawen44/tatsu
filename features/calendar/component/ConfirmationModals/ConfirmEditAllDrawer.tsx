import React from "react";
import { useEditCalendarTodo } from "@/features/calendar/query/update-calendar-todo";
import { useEditCalendarTodoInstance } from "@/features/calendar/query/update-calendar-todo-instance";
import { TodoItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer";

type ConfirmEditAllProp = {
    todo: TodoItemType;
    rruleChecksum: string;
    dateRangeChecksum: string;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
    editAllDialogOpen: boolean;
    setEditAllDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmEditAllDrawer({
    todo,
    rruleChecksum,
    dateRangeChecksum,
    setDisplayForm,
    editAllDialogOpen,
    setEditAllDialogOpen,
}: ConfirmEditAllProp) {
    const modalDict = useTranslations("modal");
    const { editCalendarTodo } = useEditCalendarTodo();
    const { editCalendarTodoInstance } = useEditCalendarTodoInstance();

    return (
        <Drawer open={editAllDialogOpen} onOpenChange={setEditAllDialogOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{modalDict("editAll.title")}</DrawerTitle>
                    <DrawerDescription>{modalDict("editAll.subtitle")}</DrawerDescription>
                </DrawerHeader>

                <DrawerFooter className="gap-2">
                    <Button
                        onMouseDown={(e) => e.stopPropagation()}
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            editCalendarTodoInstance(todo);
                            setEditAllDialogOpen(false);
                            setDisplayForm(false);
                        }}
                    >
                        {modalDict("editAll.editInstance")}
                    </Button>

                    <Button
                        onMouseDown={(e) => e.stopPropagation()}
                        variant="destructive"
                        className="w-full"
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
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
