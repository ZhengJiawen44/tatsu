import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Options, RRule } from "rrule";
import RepeatEndOption from "../../Dropdowns/RepeatDropdown/repeatModalMenu/RepeatEndOption";
import RepeatEveryOption from "../../Dropdowns/RepeatDropdown/repeatModalMenu/RepeatEveryOption";
import RepeatOnOption from "../../Dropdowns/RepeatDropdown/repeatModalMenu/RepeatOnOption";
import { cn } from "@/lib/utils";

type CustomRepeatDrawerProps = {
    rruleOptions: Partial<Options> | null;
    setRruleOptions: React.Dispatch<React.SetStateAction<Partial<Options> | null>>;
    derivedRepeatType: string | null;
    className?: string;
};

export default function CustomRepeatDrawer({
    rruleOptions,
    setRruleOptions,
    className,
}: CustomRepeatDrawerProps) {
    const appDict = useTranslations("app");
    const freq = rruleOptions?.freq;
    return (
        <div className={cn("max-h-[92vh]", className)}>
            <div className="mx-auto w-full max-w-lg flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Frequency & Interval */}
                    <section className="space-y-4">

                        <div className="bg-secondary/10 rounded-md p-4 border">
                            <RepeatEveryOption
                                customRepeatOptions={rruleOptions}
                                setCustomRepeatOptions={setRruleOptions}
                            />
                        </div>
                    </section>

                    {/* Specific Days (byday) */}
                    {freq == RRule.WEEKLY &&
                        <>
                            <section className="space-y-4">
                                <div className="bg-secondary/10 rounded-md p-4 border">
                                    <RepeatOnOption
                                        customRepeatOptions={rruleOptions}
                                        setCustomRepeatOptions={setRruleOptions}
                                    />
                                </div>
                            </section>

                        </>
                    }
                    {/* End Condition (until/count) */}
                    <section className="space-y-4">

                        <div className="bg-secondary/10 rounded-md p-4 border">
                            <RepeatEndOption
                                customRepeatOptions={rruleOptions}
                                setCustomRepeatOptions={setRruleOptions}
                            />
                        </div>
                    </section>
                </div>

                <div className="p-6 pt-2  bg-background  w-full max-w-lg " >
                    <Button
                        className=" w-full rounded-md bg-inherit border text-foreground "
                        onClick={() => setRruleOptions(rruleOptions)}
                        data-close-on-click
                    >
                        {appDict("save")}
                    </Button>
                </div>
            </div>
        </div>

    );
};
