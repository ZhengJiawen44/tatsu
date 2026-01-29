import NestedDrawerItem from "@/components/mobile/NestedDrawerItem";
import { NonNullableDateRange } from "@/types";
import { startOfDay, nextMonday, addDays, endOfDay, differenceInDays } from "date-fns";
import { Sun, Sunrise, CalendarIcon, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SetStateAction } from "react";
import DurationPicker from "./DurationPicker"
import { formatDayAbbr } from "@/lib/formatDayAbbr";

export function DateDrawerMenu({ dateRange, setDateRange }: { dateRange: NonNullableDateRange, setDateRange: React.Dispatch<SetStateAction<NonNullableDateRange>> }) {
    const locale = useLocale();
    const nextWeek = startOfDay(nextMonday(dateRange?.from || new Date()));
    const tomorrow = startOfDay(addDays(dateRange?.from || new Date(), 1));
    const appDict = useTranslations("app");
    return (

        <div className="p-4 space-y-4 w-full max-w-lg m-auto  text-sm">
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
                    <Sun className="!w-5 !h-5 stroke-[1.8px]" />
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
                    <Sunrise className="!w-5 !h-5" />
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
                    <CalendarIcon strokeWidth={1.4} className="!w-5 !h-5" />
                    {appDict("nextWeek")}
                </div>
                <p className="text-xs text-muted-foreground">
                    {formatDayAbbr(nextWeek)}
                </p>
            </div>
            <NestedDrawerItem
                className="flex w-full !gap-3 cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50 text-base"
                title="Duration"
                icon={<Clock className="w-4 h-4 sm:w-4 sm:h-4" />}
                label=""
            ><DurationPicker dateRange={dateRange} setDateRange={setDateRange} /></NestedDrawerItem>
        </div>

    )
}