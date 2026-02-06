import NestedDrawerItem from "@/components/mobile/NestedDrawerItem";
import { formatDayAbbr } from "@/lib/formatDayAbbr";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { Options, RRule } from "rrule";
import CustomRepeatDrawer from "./CustomRepeatDrawer";

export default function RepeatDrawerMenu({ rruleOptions, setRruleOptions, derivedRepeatType }: {
    rruleOptions: Partial<Options> | null;
    setRruleOptions: React.Dispatch<
        React.SetStateAction<Partial<Options> | null>
    >, derivedRepeatType:
    | "Weekday"
    | "Weekly"
    | "Custom"
    | "Daily"
    | "Monthly"
    | "Daily"
    | "Yearly"
    | null;
}) {
    const appDict = useTranslations("app");
    const locale = useLocale();



    // Helper function to format ordinal day (1st, 2nd, 3rd, etc.)
    const formatOrdinalDay = (date: Date): string => {
        return new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
    };

    // Helper function to format month and ordinal day
    const formatMonthDay = (date: Date): string => {
        return new Intl.DateTimeFormat(locale, {
            month: "short",
            day: "numeric"
        }).format(date);
    };
    return (

        <div className="p-4 space-y-4 w-full max-w-lg m-auto text-base">
            {/* Every Day */}
            <div
                className={clsx("flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50", derivedRepeatType === "Daily" && "bg-accent")}
                onClick={() =>
                    setRruleOptions(() => {
                        return { freq: RRule.DAILY };
                    })
                }
                data-close-on-click
            >
                <div className="flex items-center gap-2">

                    <span className="text-base">{appDict("everyDay")}</span>
                </div>
            </div>
            {/* Every Week */}
            <div
                className={clsx("flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50", derivedRepeatType === "Weekly" && "bg-accent")}
                onClick={() =>
                    setRruleOptions(() => {
                        return { freq: RRule.WEEKLY };
                    })
                }
                data-close-on-click
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{appDict("everyWeek")}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                    {appDict("customMenu.on")} {formatDayAbbr(new Date())}
                </span>
            </div>
            {/* Every Month */}
            <div
                className={clsx("flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50", derivedRepeatType === "Monthly" && "bg-accent")}
                onClick={() =>
                    setRruleOptions(() => {
                        return { freq: RRule.MONTHLY };
                    })
                }
                data-close-on-click
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{appDict("everyMonth")}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                    {appDict("customMenu.on")} {formatOrdinalDay(new Date())}
                </span>
            </div>
            {/* Every Year */}
            <div
                className={clsx("flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50", derivedRepeatType === "Yearly" && "bg-accent")}
                onClick={() => {
                    setRruleOptions(() => {
                        return { freq: RRule.YEARLY };
                    })
                }
                }
                data-close-on-click
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{appDict("everyYear")}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                    {appDict("customMenu.on")} {formatMonthDay(new Date())}
                </span>
            </div>
            {/* Weekdays only */}
            <div
                className={clsx("flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50", derivedRepeatType === "Weekday" && "bg-accent")}
                onClick={() =>
                    setRruleOptions(() => {
                        return {
                            freq: RRule.WEEKLY,
                            byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                        };
                    })
                }
                data-close-on-click
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{appDict("weekdaysOnly")}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">Mon-Fri</span>
            </div>

            <NestedDrawerItem
                className="flex w-full gap-3! cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent/50 text-base"
                title="Custom"
                icon={<></>}
                label=""
            >
                <CustomRepeatDrawer rruleOptions={rruleOptions} setRruleOptions={setRruleOptions} derivedRepeatType={null} />
            </NestedDrawerItem>

            {/* clear repeat */}
            {rruleOptions &&
                <div
                    className={clsx("flex bg-inherit w-full cursor-pointer items-center justify-center border rounded-md p-2 hover:bg-red/40 hover:text-foreground! text-red", derivedRepeatType === "Monthly" && "bg-accent")}
                    onClick={() =>
                        setRruleOptions(() => {
                            return null;
                        })
                    }
                    data-close-on-click
                >
                    <div className="flex items-center gap-2  ">
                        <span className="text-base">Clear</span>
                    </div>
                </div>}
        </div>
    )
}
