
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { RRule } from "rrule";
import { Clock, Flag, Repeat, Check, Hash } from "lucide-react";
import NestedDrawerItem from "@/components/mobile/NestedDrawerItem";
import { TodoItemType } from "@/types";
import { getDisplayDate } from "@/lib/date/displayDate";
import { useUserTimezone } from "@/features/user/query/get-timezone";
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
import { useEditCalendarTodo } from "@/features/calendar/query/update-calendar-todo";
import ConfirmEditAllDrawer from "../../../ConfirmationModals/ConfirmEditAllDrawer";
import ConfirmCancelEditDrawer from "../../../ConfirmationModals/ConfirmCancelEditDrawer";
import ProjectDrawer from "../../FormFields/Drawers/ProjectDrawer/ProjectDrawer";
import ProjectTag from "@/components/ProjectTag";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import NLPTitleInput from "@/components/todo/component/TodoForm/NLPTitleInput";
import deriveRepeatType from "@/lib/deriveRepeatType";
import { DateRange } from "react-day-picker";
// --- Types ---
type CreateCalendarFormProps = {
    todo: TodoItemType
    displayForm: boolean;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

// --- Main Component ---
export default function CreateCalendarDrawer({
    todo,
    displayForm,
    setDisplayForm,
}: CreateCalendarFormProps) {
    const appDict = useTranslations("app");
    const priorityMap = { "Low": "normal", "Medium": "important", "High": "urgent" }
    const repeatMap = { "Daily": "everyDay", "Weekly": "everyWeek", "Monthly": "everyMonth", "Yearly": "everyYear", "Weekday": "weekdaysOnly", "Custom": "custom" }
    const titleRef = useRef(null);
    const locale = useLocale();
    const userTZ = useUserTimezone()
    const { projectMetaData } = useProjectMetaData();

    const dateRangeChecksum = useMemo(
        () => `${todo.dtstart?.toISOString() ?? "null"}-${todo.due?.toISOString() ?? "null"}`
        ,
        [todo.dtstart, todo.due],
    );
    const rruleChecksum = useMemo(() => todo.rrule, [todo.rrule]);

    const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);
    const [editAllDialogOpen, setEditAllDialogOpen] = useState(false);

    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const [priority, setPriority] = useState(todo.priority);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: todo.dtstart || undefined,
        to: todo.due || undefined,
    });
    const [rruleOptions, setRruleOptions] = useState(
        todo?.rrule ? RRule.parseString(todo.rrule) : null,
    );
    const [projectID, setProjectID] = useState<string | null>(todo.projectID);


    const hasUnsavedChanges = useMemo(() => {
        const rruleString = rruleOptions
            ? RRule.optionsToString(rruleOptions)
            : null;

        return (
            title !== todo.title ||
            description !== (todo.description ?? "") ||
            priority !== todo.priority ||
            dateRange.from?.getTime() !== todo.dtstart?.getTime() ||
            dateRange.to?.getTime() !== todo.due?.getTime() ||
            rruleString !== (todo.rrule ?? null)
        );
    }, [title, description, priority, dateRange, rruleOptions, todo]);

    const { editCalendarTodo, editTodoStatus } = useEditCalendarTodo();

    useEffect(() => {
        if (editTodoStatus === "success") {
            setDisplayForm(false);
        }
    }, [editTodoStatus, setDisplayForm]);

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setCancelEditDialogOpen(true);
            return;
        }
        setDisplayForm(false);
    };
    const derivedRepeatType = deriveRepeatType({ rruleOptions });


    return (
        <>
            <ConfirmCancelEditDrawer
                cancelEditDialogOpen={cancelEditDialogOpen}
                setCancelEditDialogOpen={setCancelEditDialogOpen}
                setDisplayForm={setDisplayForm}
            />
            <ConfirmEditAllDrawer
                todo={{
                    ...todo,
                    title,
                    description,
                    priority,
                    dtstart: dateRange.from,
                    due: dateRange.to,
                    rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
                    projectID
                }}
                rruleChecksum={rruleChecksum!}
                dateRangeChecksum={dateRangeChecksum}
                setDisplayForm={setDisplayForm}
                editAllDialogOpen={editAllDialogOpen}
                setEditAllDialogOpen={setEditAllDialogOpen}
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
                        <form className="flex flex-col gap-6 mt-2" onSubmit={
                            (e) => {
                                e.preventDefault();
                                if (todo.rrule) {
                                    setEditAllDialogOpen(true);
                                } else {
                                    editCalendarTodo({
                                        ...todo,
                                        rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
                                        title,
                                        description,
                                        priority,
                                        dtstart: dateRange.from,
                                        due: dateRange.to,
                                        projectID
                                    });
                                }
                            }}>
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
                                    title={appDict("date")}
                                    icon={<Clock className="w-4 h-4" />}
                                    label={getDisplayDate(dateRange.from, false, locale, userTZ)}
                                >
                                    <div className="space-y-4 w-full max-w-lg m-auto">
                                        <DateDrawerMenu
                                            dateRange={dateRange}
                                            setDateRange={setDateRange}
                                        />

                                        <DrawerClose className="flex! justify-center! items-center! w-full!">
                                            <div className="w-[92%]! py-1.5 rounded-md h-fit text-foreground font-normal border bg-inherit hover:bg-lime/90">
                                                {appDict("save")}
                                            </div>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Priority */}
                                <NestedDrawerItem
                                    icon={<Flag className="w-4 h-4" />}
                                    label={appDict(priorityMap[priority])}
                                    title={appDict("priority")}
                                >
                                    <div className="p-4 space-y-2 w-full max-w-lg m-auto">
                                        {Object.entries(priorityMap).map(([key, val]) => (
                                            <button
                                                key={key}
                                                onClick={() => setPriority(key as "Low" | "Medium" | "High")}
                                                data-close-on-click
                                                className="flex items-center justify-between w-full p-2 hover:bg-accent/50 rounded-md text-base"
                                            >
                                                <span>{appDict(val)}</span>
                                                {priority === key && (
                                                    <Check className="w-4 h-4 text-lime" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </NestedDrawerItem>

                                {/* Repeat */}
                                <NestedDrawerItem
                                    icon={<Repeat className="w-4 h-4" />}
                                    label={derivedRepeatType && appDict(repeatMap[derivedRepeatType]) || "No Repeat"}
                                    title={appDict("repeat")}
                                >
                                    <div className="p-4 space-y-2">
                                        <RepeatDrawerMenu
                                            rruleOptions={rruleOptions}
                                            setRruleOptions={setRruleOptions}
                                            derivedRepeatType={derivedRepeatType}
                                        />
                                    </div>
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
                                    title={appDict("project")}
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
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                    }}
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 h-12 rounded-md border"
                                    onClick={handleClose}
                                >
                                    {appDict("cancel")}
                                </Button>


                                <Button
                                    disabled={title.length <= 0}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (todo.rrule) {
                                            setEditAllDialogOpen(true);
                                        } else {
                                            editCalendarTodo({
                                                ...todo,
                                                rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
                                                title,
                                                description,
                                                priority,
                                                dtstart: dateRange.from,
                                                due: dateRange.to,
                                                projectID
                                            });
                                        }
                                    }}
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