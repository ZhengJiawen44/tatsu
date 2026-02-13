import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RepeatEveryOption from "./RepeatEveryOption";
import RepeatOnOption from "./RepeatOnOption";
import RepeatEndOption from "./RepeatEndOption";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useState } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";
import { Indicator } from "../../RepeatDropdownMenu";

const CustomRepeatModalMenu = ({ className }: { className?: string }) => {
  const appDict = useTranslations("app");
  const { derivedRepeatType, rruleOptions, setRruleOptions } = useTodoForm();
  const [customRepeatOptions, setCustomRepeatOptions] =
    useState<Partial<Options> | null>(
      rruleOptions || { freq: RRule.DAILY, interval: 1 },
    );
  return (
    <Dialog>
      <DialogTrigger className={className}>
        {appDict("custom")}
        <Indicator name="Custom" derivedRepeatType={derivedRepeatType} />
      </DialogTrigger>
      <DialogContent className="text-sm sm:text-base min-w-0">
        <DialogHeader>
          <DialogTitle className="font-medium">{appDict("customMenu.title")}</DialogTitle>
          <DialogDescription>{appDict("customMenu.subTitle")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mb-2">
          {/* rrule interval option */}
          <RepeatEveryOption
            customRepeatOptions={customRepeatOptions}
            setCustomRepeatOptions={setCustomRepeatOptions}
          />
          {/* rrule byday option */}
          <RepeatOnOption
            customRepeatOptions={customRepeatOptions}
            setCustomRepeatOptions={setCustomRepeatOptions}
          />
          {/* rrule until option */}
          <RepeatEndOption
            customRepeatOptions={customRepeatOptions}
            setCustomRepeatOptions={setCustomRepeatOptions}
          />
        </div>
        <DialogFooter className="mt-4 gap-3 sm:gap-2">
          <DialogClose asChild>
            <Button variant={"destructive"}>{appDict("cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setRruleOptions(customRepeatOptions);
              }}
            >
              {appDict("save")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRepeatModalMenu;
