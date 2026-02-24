import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Repeat } from "lucide-react";
import { RRule } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { format } from "date-fns";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import CustomRepeatMenuContainer from "./CustomRepeat/CustomRepeatContainer";

const RepeatDropdownMenu = ({ }) => {
  const appDict = useTranslations("app");
  const { rruleOptions, setRruleOptions, derivedRepeatType, dateRange } = useTodoForm();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={!dateRange.from}
        title={"need to set a start date"}
        className={clsx("flex items-center gap-2 rounded-md border border-input w-fit h-fit p-2! text-muted-foreground bg-inherit", dateRange.from && "cursor-pointer hover:bg-accent hover:text-accent-foreground")}
      >
        <Repeat className="w-4 h-4" />
        <p className="text-sm">{appDict("repeat")}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-62.5 text-foreground">
        <DropdownMenuItem
          className="flex justify-between"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.DAILY };
            })
          }
        >
          {appDict("everyDay")}
          <Indicator
            name="Daily"
            derivedRepeatType={derivedRepeatType}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.WEEKLY };
            })
          }
        >
          <p>
            {appDict("everyWeek")}
            <span className="text-xs text-muted-foreground ml-4">
              on{format(new Date(), " EEE")}
            </span>
          </p>
          <Indicator
            name="Weekly"
            derivedRepeatType={derivedRepeatType}

          />


        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.MONTHLY };
            })
          }
        >

          <p>
            {appDict("everyMonth")}
            <span className="text-xs ml-4 text-muted-foreground">
              on the {format(new Date(), " do")}
            </span>
          </p>
          <Indicator
            name="Monthly"
            derivedRepeatType={derivedRepeatType}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between"
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.YEARLY };
            })
          }
        >
          <p>
            {appDict("everyYear")}
            <span className="text-xs ml-4 text-muted-foreground">
              on{format(new Date(), " MMM do")}
            </span>
          </p>
          <Indicator
            name="Yearly"
            derivedRepeatType={derivedRepeatType}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-3" />
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

          <p>
            {appDict("weekdaysOnly")}
            <span className="text-xs text-muted-foreground ml-4">Mon-Fri</span>
          </p>
          <Indicator
            name="Weekday"
            derivedRepeatType={derivedRepeatType}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* custom repeat */}
          <CustomRepeatMenuContainer />
        </DropdownMenuItem>

        {rruleOptions && (
          <>
            <DropdownMenuSeparator className="my-3" />
            <DropdownMenuItem
              className="text-red gap-1 flex justify-center  hover:bg-red/80! hover:text-white!"
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

export function Indicator({ derivedRepeatType, name }: { derivedRepeatType: "Monthly" | "Daily" | "Weekly" | "Yearly" | "Weekday" | "Custom" | null, name: "Monthly" | "Daily" | "Weekly" | "Yearly" | "Weekday" | "Custom" | null }) {
  return <div
    className={clsx(
      "w-1.5 h-1.5 bg-muted-foreground rounded-full opacity-0",
      derivedRepeatType == name && "opacity-100",
    )}
  />
}