import { DrawerClose } from "@/components/ui/drawer";
import { NonNullableDateRange } from "@/types";
import { isSameDay, isValid, format, parse } from "date-fns";
import { Clock, Flag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"

export default function DurationPicker({
    dateRange,
    setDateRange,
}: {
    dateRange: NonNullableDateRange;
    setDateRange: React.Dispatch<React.SetStateAction<NonNullableDateRange>>;
}) {
    const appDict = useTranslations("app");
    const locale = useLocale();

    // Local state for time strings to avoid "jumping" while typing
    const [timeFrom, setTimeFrom] = useState(format(dateRange.from, "HH:mm"));
    const [timeTo, setTimeTo] = useState(format(dateRange.to, "HH:mm"));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTimeFrom(format(dateRange.from, "HH:mm"));
        setTimeTo(format(dateRange.to, "HH:mm"));
    }, [dateRange]);

    const handleTimeChange = (type: "from" | "to", value: string) => {
        if (type === "from") setTimeFrom(value);
        else setTimeTo(value);

        const parsed = parse(value, "HH:mm", type === "from" ? dateRange.from : dateRange.to);

        if (!isValid(parsed)) return;

        setDateRange((prev) => {
            const newRange = { ...prev };
            if (type === "from") {
                newRange.from = parsed;
                if (parsed > prev.to) {
                    newRange.to = parsed;
                    setTimeTo(format(parsed, "HH:mm"));
                }
            } else {
                if (isSameDay(prev.from, parsed) && parsed < prev.from) {
                    setError(appDict("durationMenu.error"));
                    return prev;
                }
                newRange.to = parsed;
            }
            setError(null);
            return newRange;
        });
    };

    const formatDateFull = (date: Date) => {
        return new Intl.DateTimeFormat(locale, {
            weekday: "short",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-4">
                {/* START TIME BLOCK */}
                <div className="group relative flex flex-col gap-3 bg-secondary/20 p-5 rounded-3xl border-2 border-transparent focus-within:border-lime transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Starts</span>
                        <span className="text-xs font-medium text-muted-foreground/60">{formatDateFull(dateRange.from)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <input
                            type="time"
                            value={timeFrom}
                            onChange={(e) => handleTimeChange("from", e.target.value)}
                            className="bg-transparent text-4xl sm:text-5xl font-black tracking-tighter focus:outline-hidden w-full cursor-pointer"
                        />
                    </div>
                </div>

                {/* CONNECTING ICON */}
                <div className="flex justify-center -my-6 z-10">
                    <div className="bg-background border-2 border-border p-2 rounded-full shadow-xs">
                        <Clock className="w-4 h-4 sm:w-4 sm:h-4 text-lime" />
                    </div>
                </div>

                {/* END TIME BLOCK */}
                <div className={`group relative flex flex-col gap-3 p-5 rounded-3xl border-2 transition-all ${error ? 'bg-red-50 border-red-200' : 'bg-secondary/20 border-transparent focus-within:border-lime'
                    }`}>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Ends</span>
                        <span className="text-xs font-medium text-muted-foreground/60">{formatDateFull(dateRange.to)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <input
                            type="time"
                            value={timeTo}
                            onChange={(e) => handleTimeChange("to", e.target.value)}
                            className="bg-transparent  text-4xl sm:text-5xl font-black tracking-tighter focus:outline-hidden w-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-md  border border-red-100 animate-in fade-in zoom-in-95">
                    <Flag className="w-4 h-4 shrink-0" />
                    <p className="text-sm font-semibold">{error}</p>
                </div>
            )}

            {/* SUMMARY FOOTER */}
            <div className="mt-4 pt-6 flex items-center justify-between">
                <DrawerClose asChild>
                    <Button className=" px-8 h-fit py-1.5! text-base rounded-md bg-transparent hover:text-foreground border  w-full">
                        {appDict("save")}
                    </Button>
                </DrawerClose>
            </div>
        </div>
    );
}