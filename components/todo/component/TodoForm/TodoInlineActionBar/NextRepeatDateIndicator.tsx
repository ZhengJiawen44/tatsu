import React from "react";
import { RefreshCcwDot } from "lucide-react";
import { format, isThisYear } from "date-fns";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { useNextCalculatedRepeatDate } from "@/components/todo/hooks/useNextRepeatDate";
import { rruleDateToLocal } from "@/components/todo/lib/rruleDateToLocal";
import { useTranslations } from "next-intl";

const NextRepeatDateIndicator = () => {
  const todayDict = useTranslations("today");
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
        <RefreshCcwDot
          className={clsx(
            "w-4 h-4 text-orange cursor-pointer hover:-rotate-180 transition-rotate duration-500",
          )}
        />
      </TooltipTrigger>
      <TooltipContent className="text-sm min-w-0! max-w-[90vw] p-3 bg-sidebar/80 brightness-110 border backdrop-blur-md">
        <p className="min-w-0!">
          {nextCalculatedRepeatDate
            ? `${todayDict("nextRepeatText")} ${isThisYear(new Date()) ? format(rruleDateToLocal(nextCalculatedRepeatDate), "dd MMM") : format(nextCalculatedRepeatDate, "dd MMM yyyy")} (${locallyInferredRruleObject?.toText()})`
            : "This todo has reached the end of repeat"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NextRepeatDateIndicator;
