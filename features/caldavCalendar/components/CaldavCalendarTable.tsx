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
import { CaldavCalendar } from "@/types";
import { AlertCircle } from "lucide-react";

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
        .map((caldavCalendar) => (
          <CaldavCalendarTableItem
            key={caldavCalendar.id}
            caldavCalendar={caldavCalendar}
            onSelect={editCaldavCalendarMutateFn}
          />
        ))}
      <span className="block text-muted-foreground pl-4">
        <br />
        {caldavCalendars.find((calendar) => calendar.selected === true) ===
        undefined ? (
          <>
            <AlertCircle className="inline w-4 h-4 mr-1 my-auto text-foreground" />
            Select a calendar to store your todos henceforth. If none are
            selected, sync will be{" "}
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
          </>
        ) : (
          "tatsu is two way synced to your caldav server"
        )}
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

function CaldavCalendarTableItem({
  caldavCalendar,
  onSelect,
}: {
  caldavCalendar: CaldavCalendar;
  onSelect: (caldavCalendar: CaldavCalendar) => void;
}) {
  if (!caldavCalendar.currentUserPrivilegeSet.includes("write"))
    return (
      <div>
        <span className="flex justify-start items-center gap-2 p-2 rounded-sm opacity-50">
          <CalendarSelectedIndicator
            selected={caldavCalendar.selected == true}
          />
          <p>{caldavCalendar.name}</p>
          {!caldavCalendar.currentUserPrivilegeSet.includes("write") && (
            <span className="bg-border rounded-full px-2 py-1">read only</span>
          )}
        </span>
        <LineSeparator className="mb-1" />
      </div>
    );
  return (
    <div>
      <span
        onClick={() => {
          onSelect(caldavCalendar);
        }}
        className="flex justify-start items-center gap-2 hover:bg-accent p-2 rounded-sm cursor-pointer"
      >
        <CalendarSelectedIndicator selected={caldavCalendar.selected == true} />
        <p>{caldavCalendar.name}</p>
      </span>
      <LineSeparator className="mb-1" />
    </div>
  );
}

function CalendarSelectedIndicator({ selected }: { selected: boolean }) {
  return (
    <div className="w-4.5 h-4.5 border-lime opacity-80 rounded-full border-[1.5px] flex items-center justify-center">
      {selected && <div className="w-1/3 h-1/3 bg-lime rounded-full" />}
    </div>
  );
}
