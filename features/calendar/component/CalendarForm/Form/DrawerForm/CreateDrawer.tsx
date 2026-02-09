import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Options, RRule } from "rrule";
import { Clock, Flag, Repeat, Check, Hash } from "lucide-react";
import NestedDrawerItem from "@/components/mobile/NestedDrawerItem";
import { TodoItemType, NonNullableDateRange } from "@/types";
import { getDisplayDate } from "@/lib/date/displayDate";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DateDrawerMenu } from "../../FormFields/Drawers/DateDrawer/DateDrawerMenu";
import RepeatDrawerMenu from "../../FormFields/Drawers/RepeatDrawer/RepeatDrawerMenu";
import { useCreateCalendarTodo } from "@/features/calendar/query/create-calendar-todo";
import ConfirmCancelEditDrawer from "../../../ConfirmationModals/ConfirmCancelEditDrawer";
import ProjectDrawer from "../../FormFields/Drawers/ProjectDrawer/ProjectDrawer";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import ProjectTag from "@/components/ProjectTag";
import NLPTitleInput from "@/components/todo/component/TodoForm/NLPTitleInput";
import deriveRepeatType from "@/lib/deriveRepeatType";

// --- Types ---
type CreateCalendarFormProps = {
    start: Date;
    end: Date;
    displayForm: boolean;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

// --- Main Component ---
export default function CreateCalendarDrawer({
    start,
    end,
    displayForm,
    setDisplayForm,
}: CreateCalendarFormProps) {
    const appDict = useTranslations("app");
    const locale = useLocale();
    const titleRef = useRef(null);

    const { projectMetaData } = useProjectMetaData();
    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TodoItemType["priority"]>("Low");
    const [dateRange, setDateRange] = useState<NonNullableDateRange>({
        from: start,
        to: end,
    });
    const [rruleOptions, setRruleOptions] = useState<Partial<Options> | null>(null);
    const [projectID, setProjectID] = useState<string | null>(null);
    const derivedRepeatType = deriveRepeatType({ rruleOptions });

    const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);
    const { createCalendarTodo, createTodoStatus } = useCreateCalendarTodo();

    const hasUnsavedChanges = useMemo(() => {
        return title !== "" || description !== "" || priority !== "Low";
    }, [title, description, priority]);

    useEffect(() => {
        if (createTodoStatus === "success") setDisplayForm(false);
    }, [createTodoStatus, setDisplayForm]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        createCalendarTodo({
            title,
            description,
            priority,
            dtstart: dateRange.from,
            due: dateRange.to,
            rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
            projectID: projectID
        });
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setCancelEditDialogOpen(true);
            return;
        }
        setDisplayForm(false);
    };

    return (
        <>
            <ConfirmCancelEditDrawer
                cancelEditDialogOpen={cancelEditDialogOpen}
                setCancelEditDialogOpen={setCancelEditDialogOpen}
                setDisplayForm={setDisplayForm}
            />

            <Drawer
                open={displayForm}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose();
                    } else {
                        setDisplayForm(true);
                    }
                }}
            >
                <DrawerContent className="max-h-[96vh] flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle className="hidden">create todo</DrawerTitle>
                    </DrawerHeader>

                    <div className="mx-auto w-full max-w-lg overflow-y-auto p-4 pt-0">
                        <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit}>
                            {/* Title Input */}
                            <NLPTitleInput
                                setProjectID={setProjectID}
                                titleRef={titleRef}
                                title={title}
                                setTitle={setTitle}
                                setDateRange={setDateRange}
                                className="flex-1 min-w-0 bg-transparent border-b border-border py-1 text-lg focus:outline-hidden focus:border-lime"
                            />

                            {/* List-style Menu */}
                            <div className="flex flex-col border rounded-md divide-y bg-secondary/20">
                                {/* Date */}
                                <NestedDrawerItem
                                    title="Date"
                                    icon={<Clock className="w-4 h-4" />}
                                    label={getDisplayDate(dateRange.from, false, locale)}
                                >
                                    <div className="space-y-4 w-full max-w-lg m-auto">
                                        <DateDrawerMenu
                                            dateRange={dateRange}
                                            setDateRange={setDateRange}
                                        />

                                        <DrawerClose className="flex justify-center! items-center w-full" >
                                            <div className="rounded-md w-[92%] h-fit py-1.5! text-foreground font-normal border bg-inherit hover:bg-lime/90">
                                                {appDict("save")}
                                            </div>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Priority */}
                                <NestedDrawerItem
                                    icon={<Flag className="w-4 h-4" />}
                                    label={priority}
                                    title={appDict("priority")}
                                >
                                    <div className="p-4 space-y-2 w-full max-w-lg m-auto">
                                        {(["Low", "Medium", "High"] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPriority(p)}
                                                data-close-on-click
                                                className="flex items-center justify-between w-full p-2 hover:bg-accent/50 rounded-md text-base"
                                            >
                                                <span>{p}</span>
                                                {priority === p && (
                                                    <Check className="w-4 h-4 text-lime" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </NestedDrawerItem>

                                {/* Repeat */}
                                <NestedDrawerItem
                                    icon={<Repeat className="w-4 h-4" />}
                                    label={(rruleOptions && derivedRepeatType) || "No Repeat"}
                                    title={appDict("repeat")}
                                >
                                    <RepeatDrawerMenu
                                        rruleOptions={rruleOptions}
                                        setRruleOptions={setRruleOptions}
                                        derivedRepeatType={derivedRepeatType}
                                    />
                                </NestedDrawerItem>

                                {/* project */}
                                <NestedDrawerItem
                                    icon={<Hash className="w-4 h-4" />}
                                    label={
                                        projectID
                                            ?
                                            <>
                                                <ProjectTag id={projectID} />
                                                <span>{projectMetaData[projectID]?.name}</span>
                                            </>
                                            :
                                            "No project"
                                    }
                                    title={"Project"}
                                >
                                    <div className="p-4 space-y-2">
                                        <ProjectDrawer projectID={projectID} setProjectID={setProjectID} />
                                    </div>
                                </NestedDrawerItem>
                            </div>

                            {/* Description */}
                            <textarea
                                className="w-full bg-secondary/40 rounded-md p-3 text-lg resize-none border max-h-[85dvh]outline-none focus:outline-hidden focus:ring-0"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={appDict("descPlaceholder")}
                            />

                            <DrawerFooter className="px-0 flex-row gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 h-12 rounded-md border"
                                    onClick={handleClose}
                                >
                                    {appDict("cancel")}
                                </Button>

                                <Button
                                    disabled={title.length <= 0}
                                    onClick={handleSubmit}
                                    className="flex-1 h-12 rounded-md bg-lime hover:bg-lime/90 text-white font-bold"
                                >
                                    {appDict("save")}
                                </Button>
                            </DrawerFooter>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}



