import LineSeparator from "@/components/ui/lineSeparator";
import Spinner from "@/components/ui/spinner";
import { useCaldavCalendar } from "@/features/caldavCalendar/query/get-caldav-calendar";
import { useEditCaldavCalendar } from "@/features/caldavCalendar/query/update-caldav-calendar";
import clsx from "clsx";
import { Check } from "lucide-react";

export default function CaldavCalendarTable(){
    const {caldavCalendars} = useCaldavCalendar();
    const {editCaldavCalendarMutateFn, editCaldavCalendarStatus} = useEditCaldavCalendar();
    return (
        <div className="p-6 pt-2 flex flex-col">
        <span className="flex items-center gap-1 text-muted-foreground ">

        <br/>
        {"Select a calendar where tatsu will store its todos. if none are selected, sync will be one way only (todos created here will not be syned to your provider)"}
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
              <Spinner className={clsx("w-5 h-5 ml-auto mt-4 opacity-0", editCaldavCalendarStatus === "pending" && "opacity-100")}/>

      </div>
    )
}