import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Options, RRule } from "rrule";
import RepeatEndOption from "../repeatModalMenu/RepeatEndOption";
import RepeatOnOption from "../repeatModalMenu/RepeatOnOption";
import RepeatEveryOption from "../repeatModalMenu/RepeatEveryOption";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

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
        <Drawer>
            <DrawerTrigger className="flex w-full text-sm hover:bg-popover-accent cursor-pointer justify-between p-1.5 px-2">
                {appDict("custom")}
            </DrawerTrigger>
            <DrawerContent>

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
                            <DrawerClose asChild>
                                <Button
                                    className=" w-full rounded-md bg-inherit border text-foreground "
                                    onClick={() => setRruleOptions(rruleOptions)}
                                    data-close-on-click
                                >
                                    {appDict("save")}
                                </Button>
                            </DrawerClose>


                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>

    );
};
