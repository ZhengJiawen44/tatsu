
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { RRule } from "rrule";
import { Clock, Flag, Repeat, Check } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { DateDrawerMenu } from "../DateDropdown/Mobile/DateDrawerMenu";
import RepeatDrawerMenu from "../RepeatDropdown/Mobile/RepeatDrawerMenu";
import { useEditCalendarTodo } from "@/features/calendar/query/update-calendar-todo";
import ConfirmEditAllDrawer from "../ConfirmEditAllDrawer";
import ConfirmCancelEditDrawer from "../ConfirmCancelEditDrawer";
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
    const todayDict = useTranslations("today");
    const locale = useLocale();
    const dateRangeChecksum = useMemo(
        () => todo.dtstart.toISOString() + todo.due.toISOString(),
        [todo.dtstart, todo.due],
    );
    const rruleChecksum = useMemo(() => todo.rrule, [todo.rrule]);

    const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);
    const [editAllDialogOpen, setEditAllDialogOpen] = useState(false);

    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const [priority, setPriority] = useState(todo.priority);
    const [dateRange, setDateRange] = useState<NonNullableDateRange>({
        from: todo.dtstart,
        to: todo.due,
    });
    const [rruleOptions, setRruleOptions] = useState(
        todo?.rrule ? RRule.parseString(todo.rrule) : null,
    );

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
    const derivedRepeatType = useMemo(() => {
        if (!rruleOptions) return null;
        const f = rruleOptions.freq;
        if (f === RRule.DAILY) return "Daily";
        if (f === RRule.WEEKLY) {
            if (rruleOptions.byweekday && Array.isArray(rruleOptions.byweekday)) {
                const weekdays = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
                // check if byweekday contains all weekdays (Mon-Fri)
                const containsAllWeekdays = weekdays.every((d) =>
                    (rruleOptions.byweekday as unknown[]).some((bw) => bw === d)
                );
                if (containsAllWeekdays) return "Weekday";
            }
            return "Weekly";
        }
        if (f === RRule.MONTHLY) return "Monthly";
        if (f === RRule.YEARLY) return "Yearly";
        return null;
    }, [rruleOptions]);

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
                    <DrawerHeader><DrawerTitle className="hidden">create todo</DrawerTitle></DrawerHeader>
                    <div className="mx-auto w-full max-w-lg overflow-y-auto p-4 pt-0">
                        <form className="flex flex-col gap-6 mt-2" onSubmit={(e) => {
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
                                });
                            }
                        }}>
                            {/* Title Input */}
                            <input
                                className="w-full bg-transparent border-b border-border py-2 text-lg sm:text-xl font-medium focus:outline-none focus:border-lime"
                                placeholder={todayDict("titlePlaceholder")}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />

                            {/* List-style Menu for mobile feel */}
                            <div className="flex flex-col border rounded-md divide-y bg-secondary/20">

                                {/* Date Selection Drawer */}
                                <NestedDrawerItem
                                    title="Date"
                                    icon={<Clock className="w-4 h-4 sm:w-4 sm:h-4 " />}
                                    label={getDisplayDate(dateRange.from, false, locale)}
                                >
                                    <div className="p-4 space-y-4 w-full max-w-lg m-auto ">
                                        <DateDrawerMenu dateRange={dateRange} setDateRange={setDateRange} />
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={(range) => range?.from && setDateRange({ from: range.from, to: range.to || range.from })}
                                            className="w-full flex justify-center"
                                            classNames={{
                                                // Increase these values to make the picker wider
                                                day: " h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                                                head_cell: "w-10 font-normal text-[1rem] text-muted-foreground",
                                                cell: "h-10 w-10 text-center text-sm p-0 relative",
                                            }}
                                        />
                                        <DrawerClose asChild>
                                            <Button className="w-full bg-lime">{appDict("save")}</Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Priority Selection Drawer */}
                                <NestedDrawerItem
                                    icon={<Flag className="w-4 h-4 sm:w-4 sm:h-4" />}
                                    label={priority}
                                    title={appDict("priority")}
                                >
                                    <div className="p-4 space-y-2">
                                        {(["Low", "Medium", "High"] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPriority(p)}
                                                data-close-on-click
                                                className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-md text-sm"
                                            >
                                                <span>{p}</span>
                                                {priority === p && <Check className="w-4 h-4 sm:w-4 sm:h-4 text-lime" />}
                                            </button>
                                        ))}
                                        <DrawerClose asChild>
                                            <Button variant="outline" className="w-full mt-4">{appDict("save")}</Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Repeat Selection Drawer */}
                                <NestedDrawerItem
                                    icon={<Repeat className="w-4 h-4 sm:w-4 sm:h-4" />}
                                    label={rruleOptions && derivedRepeatType || "No Repeat"}
                                    title={appDict("repeat")}
                                >
                                    <div className="p-4 space-y-2">
                                        <RepeatDrawerMenu rruleOptions={rruleOptions} setRruleOptions={setRruleOptions} derivedRepeatType={derivedRepeatType} />
                                        {/* Simplified Repeat logic for brevity */}

                                        <DrawerClose asChild>
                                            <Button variant="outline" className="w-full mt-4">{appDict("save")}</Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                            </div>

                            {/* Description area */}
                            <div className="space-y-2">

                                <textarea
                                    className="w-full bg-secondary/40 rounded-md p-3 text-base resize-none focus:outline-none ring-1 ring-border"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={appDict("descPlaceholder")}
                                />
                            </div>

                            <DrawerFooter className="px-0 flex-row gap-3">
                                <DrawerClose asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1 h-12 rounded-md border"
                                        onClick={handleClose}
                                    >
                                        {appDict("cancel")}
                                    </Button>
                                </DrawerClose>
                                <Button

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