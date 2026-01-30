import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Options, RRule } from "rrule";
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
import { useCreateCalendarTodo } from "@/features/calendar/query/create-calendar-todo";
import ConfirmCancelEditDrawer from "../ConfirmCancelEditDrawer";

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
    const todayDict = useTranslations("today");
    const locale = useLocale();

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TodoItemType["priority"]>("Low");
    const [dateRange, setDateRange] = useState<NonNullableDateRange>({
        from: start,
        to: end,
    });
    const [rruleOptions, setRruleOptions] = useState<Partial<Options> | null>(null);
    const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);

    const { createCalendarTodo, createTodoStatus } = useCreateCalendarTodo();

    const hasUnsavedChanges = useMemo(() => {
        return title !== "" || description !== "" || priority !== "Low";
    }, [title, description, priority]);

    const derivedRepeatType = useMemo(() => {
        if (!rruleOptions) return null;
        const f = rruleOptions.freq;
        if (f === RRule.DAILY) return "Daily";
        if (f === RRule.WEEKLY) {
            if (rruleOptions.byweekday && Array.isArray(rruleOptions.byweekday)) {
                const weekdays = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
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
                            <input
                                className="w-full bg-transparent border-b border-border py-2 text-lg sm:text-xl font-medium focus:outline-none focus:border-lime"
                                placeholder={todayDict("titlePlaceholder")}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />

                            {/* List-style Menu */}
                            <div className="flex flex-col border rounded-md divide-y bg-secondary/20">
                                {/* Date */}
                                <NestedDrawerItem
                                    title="Date"
                                    icon={<Clock className="w-4 h-4" />}
                                    label={getDisplayDate(dateRange.from, false, locale)}
                                >
                                    <div className="p-4 space-y-4 w-full max-w-lg m-auto">
                                        <DateDrawerMenu
                                            dateRange={dateRange}
                                            setDateRange={setDateRange}
                                        />
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={(range) =>
                                                range?.from &&
                                                setDateRange({
                                                    from: range.from,
                                                    to: range.to || range.from,
                                                })
                                            }
                                            className="w-full flex justify-center"
                                        />
                                        <DrawerClose asChild>
                                            <Button className="w-full bg-lime">
                                                {appDict("save")}
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Priority */}
                                <NestedDrawerItem
                                    icon={<Flag className="w-4 h-4" />}
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
                                                {priority === p && (
                                                    <Check className="w-4 h-4 text-lime" />
                                                )}
                                            </button>
                                        ))}
                                        <DrawerClose asChild>
                                            <Button variant="outline" className="w-full mt-4">
                                                {appDict("save")}
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>

                                {/* Repeat */}
                                <NestedDrawerItem
                                    icon={<Repeat className="w-4 h-4" />}
                                    label={(rruleOptions && derivedRepeatType) || "No Repeat"}
                                    title={appDict("repeat")}
                                >
                                    <div className="p-4 space-y-2">
                                        <RepeatDrawerMenu
                                            rruleOptions={rruleOptions}
                                            setRruleOptions={setRruleOptions}
                                            derivedRepeatType={derivedRepeatType}
                                        />
                                        <DrawerClose asChild>
                                            <Button variant="outline" className="w-full mt-4">
                                                {appDict("save")}
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </NestedDrawerItem>
                            </div>

                            {/* Description */}
                            <textarea
                                className="w-full bg-secondary/40 rounded-md p-3 text-lg resize-none border outline-none "
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
