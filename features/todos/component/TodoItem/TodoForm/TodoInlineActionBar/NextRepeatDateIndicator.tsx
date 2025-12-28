import React from "react";
import { TbRefreshDot } from "react-icons/tb";
import { format, isThisYear } from "date-fns";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useNextCalculatedRepeatDate } from "@/features/todos/hooks/useNextRepeatDate";

const NextRepeatDateIndicator = () => {
  const { rruleOptions } = useTodoForm();
  // calculates the next date this todo will occur on, then returns that
  // date and the rrule object used for the calculation
  const { nextCalculatedRepeatDate, locallyInferredRruleObject } =
    useNextCalculatedRepeatDate();

  if (!rruleOptions) return <></>;
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <TbRefreshDot
          className={clsx(
            "w-4 h-4 text-orange cursor-pointer hover:-rotate-180 transition-rotate duration-500",
          )}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {nextCalculatedRepeatDate
            ? `This todo is next scheduled for ${isThisYear(new Date()) ? format(rruleDateToLocal(nextCalculatedRepeatDate), "dd MMM") : format(nextCalculatedRepeatDate, "dd MMM yyyy")} (${locallyInferredRruleObject?.toText()})`
            : "This todo has reached the end of repeat"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NextRepeatDateIndicator;

function rruleDateToLocal(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}
