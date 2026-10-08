import LineSeparator from "@/components/ui/lineSeparator";
import Spinner from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCaldavCalendar } from "@/features/caldavCalendar/query/get-caldav-calendar";
import { useEditCaldavCalendar } from "@/features/caldavCalendar/query/update-caldav-calendar";
import { Info, Check } from "lucide-react";

export default function CaldavCalendarTable(){
    const {caldavCalendars} = useCaldavCalendar();
    const {editCaldavCalendarMutateFn, editCaldavCalendarStatus} = useEditCaldavCalendar();
    return (
         <div className="p-6 flex flex-col">
        <span className="flex items-center gap-1 text-muted-foreground mt-3">
          Calendars
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4"/>
            </TooltipTrigger>
            <TooltipContent className="mb-2 w-90 sm:w-100 md:w-200 lg:w-fit whitespace-normal text-left">
              {"Select a calendar where tatsu will store its todos. if none are selected, sync will be one way only (todos created here will not be syned to your provider)"}
            </TooltipContent>
          </Tooltip>
          {editCaldavCalendarStatus === "pending" && <Spinner className="w-5 h-5 ml-auto"/>}
        </span>
        <br/>
        {caldavCalendars.filter((caldavCalendar)=>caldavCalendar.components.includes("VEVENT")).map((caldavCalendar)=>{
          return (
            <div key={caldavCalendar.id}>
              <span 
                onClick={()=>{
                  editCaldavCalendarMutateFn(caldavCalendar);
                }}
                className="flex justify-start items-center gap-2 hover:bg-accent p-2 rounded-sm cursor-pointer"
              >
                {caldavCalendar.selected==true && <Check className="w-5 h-5 text-lime"/>} <p>{caldavCalendar.name}</p>               
              </span>
              <LineSeparator className="mb-1"/>
            </div>
            )
          })}
      </div>
    )
}