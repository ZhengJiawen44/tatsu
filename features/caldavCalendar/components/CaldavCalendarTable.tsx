import LineSeparator from "@/components/ui/lineSeparator";
import Spinner from "@/components/ui/spinner";
import { useCaldavCalendar } from "@/features/caldavCalendar/query/get-caldav-calendar";
import { useEditCaldavCalendar } from "@/features/caldavCalendar/query/update-caldav-calendar";
import clsx from "clsx";
import { CaldavCalendarTablePlaceholder } from "./CaldavCalendarTablePlaceholder";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function CaldavCalendarTable() {
  const { caldavCalendars, caldavCalendarsLoading } = useCaldavCalendar();
  const { editCaldavCalendarMutateFn, editCaldavCalendarStatus } =
    useEditCaldavCalendar();
  return (
    <div className="p-6 pt-2 flex flex-col">
      <br />
      {caldavCalendarsLoading && <CaldavCalendarTablePlaceholder />}
      {caldavCalendars
        .filter((caldavCalendar) =>
          caldavCalendar.components.includes("VEVENT"),
        )
        .map((caldavCalendar) => {
          return (
            <div key={caldavCalendar.id}>
              <span
                onClick={() => {
                  editCaldavCalendarMutateFn(caldavCalendar);
                }}
                className="flex justify-start items-center gap-2 hover:bg-accent p-2 rounded-sm cursor-pointer"
              >
                <div className="w-4.5 h-4.5 border-lime opacity-80 rounded-full border-[1.5px] flex items-center justify-center">
                  {caldavCalendar.selected == true && (
                    <div className="w-1/3 h-1/3 bg-lime rounded-full" />
                  )}
                </div>
                <p>{caldavCalendar.name}</p>
              </span>
              <LineSeparator className="mb-1" />
            </div>
          );
        })}
      <span className="block text-muted-foreground pl-4">
        <br />
        Select a calendar to store your todos henceforth. If none are selected,
        sync will be{" "}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline">one way</span>
          </TooltipTrigger>
          <TooltipContent className="mb-1 w-75 sm:w-fit">
            todos created on this application will not be synced to your
            provider.
          </TooltipContent>
        </Tooltip>{" "}
        only
      </span>
      <Spinner
        className={clsx(
          "w-5 h-5 ml-auto mt-4 opacity-0",
          editCaldavCalendarStatus === "pending" && "opacity-100",
        )}
      />
    </div>
  );
}
