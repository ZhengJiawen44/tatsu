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
const CustomRepeatModalMenu = ({ className }: { className?: string }) => {
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
        Custom
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">Custom Repeat</DialogTitle>
          <DialogDescription>Set up a custom repeat schedule</DialogDescription>
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
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setRruleOptions(customRepeatOptions);
              }}
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRepeatModalMenu;
