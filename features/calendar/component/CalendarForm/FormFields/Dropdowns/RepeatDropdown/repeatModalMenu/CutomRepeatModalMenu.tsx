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
import { useState } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";
import { Indicator } from "@/components/todo/component/TodoForm/TodoInlineActionBar/RepeatDropdown/RepeatDropdownMenu";

type CustomRepeatModalMenuProps = {
  rruleOptions: Partial<Options> | null;
  setRruleOptions: React.Dispatch<
    React.SetStateAction<Partial<Options> | null>
  >;
  derivedRepeatType:
  | "Weekday"
  | "Weekly"
  | "Custom"
  | "Daily"
  | "Monthly"
  | "Daily"
  | "Yearly"
  | null;
  className: string | undefined;
};

const CustomRepeatModalMenu = ({
  rruleOptions,
  setRruleOptions,
  derivedRepeatType,
  className,
}: CustomRepeatModalMenuProps) => {
  const appDict = useTranslations("app");

  const [customRepeatOptions, setCustomRepeatOptions] =
    useState<Partial<Options> | null>(
      rruleOptions || { freq: RRule.DAILY, interval: 1 },
    );

  return (
    <Dialog>
      <DialogTrigger className={className}>
        {appDict("custom")}
        <Indicator
          name={"Custom"}
          derivedRepeatType={derivedRepeatType}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">
            {appDict("customMenu.title")}
          </DialogTitle>
          <DialogDescription>
            {appDict("customMenu.title")}
          </DialogDescription>
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
            <Button className="hover:bg-border">{appDict("cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="hover:bg-accent border"
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