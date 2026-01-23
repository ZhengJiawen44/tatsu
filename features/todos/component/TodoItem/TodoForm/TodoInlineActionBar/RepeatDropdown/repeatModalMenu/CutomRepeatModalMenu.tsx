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
import { CheckIcon } from "lucide-react";
import clsx from "clsx";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useState } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";

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
        <CheckIcon
          className={clsx(
            "opacity-0",
            derivedRepeatType == "Custom" && "opacity-100",
          )}
        />
        {appDict("custom")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">{appDict("customMenu.title")}</DialogTitle>
          <DialogDescription>{appDict("customMenu.subtitle")}</DialogDescription>
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
        <DialogFooter>
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
