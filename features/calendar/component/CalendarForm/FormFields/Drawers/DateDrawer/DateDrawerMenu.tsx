import NestedDrawerItem from "@/components/mobile/NestedDrawerItem";
import { startOfDay, nextMonday, addDays, endOfDay, differenceInDays } from "date-fns";
import { Sun, Sunrise, CalendarIcon, Clock, CircleMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import { SetStateAction } from "react";
import DurationPicker from "./DurationPicker"
import { formatDayAbbr } from "@/lib/formatDayAbbr";
import { Calendar } from "@/components/ui/calendar";
import LineSeparator from "@/components/ui/lineSeparator";
import { DateRange } from "react-day-picker";
import { NonNullableDateRange } from "@/types";

export function DateDrawerMenu({ dateRange, setDateRange }: { dateRange: DateRange, setDateRange: React.Dispatch<SetStateAction<DateRange>> }) {
    const nextWeek = startOfDay(nextMonday(dateRange?.from || new Date()));
    const tomorrow = startOfDay(addDays(dateRange?.from || new Date(), 1));
    const appDict = useTranslations("app");
    return (
        <>
            <div className="p-4 space-y-4 w-full max-w-lg m-auto text-base">
                {/* --- OPTION: Today --- */}
                <div
                    className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50"
                    onClick={() => {
                        setDateRange((prev) => ({
                            from: startOfDay(new Date()),
                            to:
                                prev.to && prev.from
                                    ? new Date(
                                        endOfDay(
                                            addDays(
                                                new Date(),
                                                differenceInDays(prev.to, prev.from)
                                            )
                                        )
                                    )
                                    : endOfDay(new Date()),
                        }));
                    }}
                    data-close-on-click
                >
                    <div className="flex gap-3 items-center">
                        <Sun className="w-5! h-5! stroke-[1.8px]" />
                        {appDict("today")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDayAbbr(new Date())}
                    </p>
                </div>
                {/* --- OPTION: TOMORROW --- */}
                <div
                    className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50"
                    onClick={() => {
                        setDateRange((prev) => ({
                            from: tomorrow,
                            to:
                                prev.to && prev.from
                                    ? endOfDay(
                                        addDays(tomorrow, differenceInDays(prev.to, prev.from))
                                    )
                                    : endOfDay(tomorrow),
                        }));
                    }}
                    data-close-on-click
                >
                    <div className="flex gap-3 items-center">
                        <Sunrise className="w-5! h-5!" />
                        {appDict("tomorrow")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDayAbbr(tomorrow)}
                    </p>
                </div>
                {/* --- OPTION: NEXT WEEK --- */}
                <div
                    className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50"
                    onClick={() => {
                        setDateRange((prev) => ({
                            from: nextWeek,
                            to:
                                prev.to && prev.from
                                    ? endOfDay(
                                        new Date(
                                            addDays(nextWeek, differenceInDays(prev.to, prev.from))
                                        )
                                    )
                                    : endOfDay(nextWeek),
                        }));
                    }}
                    data-close-on-click
                >
                    <div className="flex gap-3 items-center">
                        <CalendarIcon strokeWidth={1.4} className="w-5! h-5!" />
                        {appDict("nextWeek")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDayAbbr(nextWeek)}
                    </p>
                </div>

                {/* No Date */}
                <div
                    className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50"
                    onClick={() => {
                        setDateRange(() => ({
                            from: undefined,
                            to: undefined
                        }));
                    }}
                    data-close-on-click
                >
                    <div className="flex gap-3 items-center">
                        <CircleMinus className="w-5! h-5!" />
                        No Date
                    </div>
                </div>

                {/* time */}
                <NestedDrawerItem
                    disabled={!dateRange.from || !dateRange.to}
                    className="flex w-full gap-3! cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50"
                    title="Time"
                    icon={<Clock className="w-5 h-5" />}
                    label=""
                >
                    {(dateRange.from && dateRange.to) &&
                        <DurationPicker
                            dateRange={dateRange as NonNullableDateRange}
                            setDateRange={setDateRange as React.Dispatch<SetStateAction<NonNullableDateRange>>}
                        />
                    }
                </NestedDrawerItem>
            </div>
            <LineSeparator className="my-3 border-popover-border" />
            {/* day picker */}
            <Calendar
                className="w-full px-4"
                classNames={{
                    months: "w-full",
                    month: "w-full space-y-4 ",
                    table: "w-full table-fixed",
                    head_row: "w-full",
                    head_cell: "pb-2 text-muted-foreground font-normal text-xs",
                    row: "w-full",
                    cell: "w-11 h-11",
                    day: "w-11 h-11 text-sm text-foreground/80",
                    nav_button:
                        "z-50 w-10 h-10 rounded-full flex items-center justify-center bg-popover/60 hover:bg-popover-accent backdrop-blur-sm",
                    nav: "w-10 h-10"

                }}
                mode="range"
                selected={dateRange}
                onSelect={(dateRange) => setDateRange(
                    () => {
                        return { from: dateRange?.from, to: dateRange?.to }
                    })}
            />
        </>

    )
}

