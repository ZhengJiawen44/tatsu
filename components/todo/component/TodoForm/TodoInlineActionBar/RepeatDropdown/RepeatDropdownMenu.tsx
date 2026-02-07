import React from "react";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import { CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Repeat from "@/components/ui/icon/repeat";
import { RRule } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { format } from "date-fns";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const RepeatDropdownMenu = ({ }) => {
  const appDict = useTranslations("app");
  const { rruleOptions, setRruleOptions, derivedRepeatType } = useTodoForm();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit p-2! text-muted-foreground bg-inherit"
        >
          <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
          <p className="text-sm">{appDict("repeat")}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[250px] text-foreground">
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.DAILY };
            })
          }
        >
          <CheckIcon
            className={clsx(
              "opacity-0",
              derivedRepeatType == "Daily" && "opacity-100",
            )}
          />
          {appDict("everyDay")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.WEEKLY };
            })
          }
        >
          <div className="flex gap-1">
            <CheckIcon
              className={clsx(
                "opacity-0",
                derivedRepeatType == "Weekly" && "opacity-100",
              )}
            />
            <p>{appDict("everyWeek")}</p>
          </div>

          <p className="text-xs text-card-foreground-muted">
            on{format(new Date(), " EEE")}
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.MONTHLY };
            })
          }
        >
          <div className="flex gap-1">
            <CheckIcon
              className={clsx(
                "opacity-0",
                derivedRepeatType == "Monthly" && "opacity-100",
              )}
            />
            <p>{appDict("everyMonth")}</p>
          </div>
          <p className="text-xs text-card-foreground-muted">
            on the {format(new Date(), " do")}
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.YEARLY };
            })
          }
        >
          <div className="flex gap-1">
            <CheckIcon
              className={clsx(
                "opacity-0",
                derivedRepeatType == "Yearly" && "opacity-100",
              )}
            />
            <p>{appDict("everyYear")}</p>
          </div>
          <p className="text-xs text-card-foreground-muted">
            on{format(new Date(), " MMM do")}
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between"
          onClick={() =>
            setRruleOptions(() => {
              return {
                freq: RRule.WEEKLY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
              };
            })
          }
        >
          <div className="flex gap-1 items-center">
            <CheckIcon
              className={clsx(
                "opacity-0",
                derivedRepeatType == "Weekday" && "opacity-100",
              )}
            />
            <p>{appDict("weekdaysOnly")}</p>
            <p className="text-xs text-card-foreground-muted">Mon-Fri</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CustomRepeatModalMenu className="flex w-full hover:bg-accent py-2! px-1" />
        </DropdownMenuItem>

        {rruleOptions && (
          <>
            <DropdownMenuSeparator className="mt-[5px]" />
            <DropdownMenuItem
              className="text-red gap-1 flex justify-center"
              onClick={() => setRruleOptions(null)}
            >
              Clear
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepeatDropdownMenu;
