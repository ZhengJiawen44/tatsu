import React from "react";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
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
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const RepeatDropdownMenu = ({ }) => {
  const appDict = useTranslations("app");
  const { rruleOptions, setRruleOptions, derivedRepeatType } = useTodoForm();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit p-2! text-muted-foreground bg-inherit cursor-pointer"
        >
          <Repeat className="w-4 h-4" />
          <p className="text-sm">{appDict("repeat")}</p>
        </Button>
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
          Daily
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
            Weekly
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
            Monthly
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
            Yearly
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
            Weekdays
            <span className="text-xs text-muted-foreground ml-4">Mon-Fri</span>
          </p>
          <Indicator
            name="Weekday"
            derivedRepeatType={derivedRepeatType}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CustomRepeatModalMenu className="flex w-full justify-between hover:bg-accent p-1.5 px-2" />
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