import { Button } from "@/components/ui/button";
import { Check, Info, RefreshCw, Unlink } from "lucide-react";
import React from "react";
import { useCalDavAccount } from "../../calendarCredential/query/get-calDavAccount";
import { useDeleteCalDavAccount } from "../../calendarCredential/query/delete-calDavAccount";
import { useResyncCalDavAccount } from "../../calendarCredential/query/resync-calDavAccount";
import { useTranslations } from "next-intl";
import { useCaldavCalendar } from "../query/get-caldav-calendar";
import LineSeparator from "@/components/ui/lineSeparator";
import { Tooltip, TooltipContent, TooltipTrigger  } from "@/components/ui/tooltip";

export default function SyncCard() {
  const t = useTranslations("sync");
  const { calDavAccount } = useCalDavAccount();
  const {caldavCalendars} = useCaldavCalendar();
  const { deleteMutateFn } = useDeleteCalDavAccount();
  const { resyncMutateFn, resyncStatus } = useResyncCalDavAccount();
  return (
    <div className="border rounded-md bg-background w-full mb-8 pb-8">
      <div className="flex gap-4 justify-between bg-card p-4 py-8 items-center border-b">
        <p className="text-2xl">
          <span className="text-muted-foreground text-xs">{t("syncedTo")}</span>{" "}
          {"  "}
          <span>{calDavAccount?.service || t("nothing")}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className=""
            onClick={() => resyncMutateFn()}
          >
            <RefreshCw
              className={
                "w-4 h-4 " + (resyncStatus === "pending" ? "animate-spin" : "")
              }
            />
            {t("resync")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutateFn();
            }}
          >
            <Unlink className="w-4 h-4" />
            {t("unsync")}
          </Button>
        </div>
      </div>
      <div className="p-6 flex flex-col">
        <span className="flex items-center gap-1 text-muted-foreground mt-3">
          Calendars
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4"/>
            </TooltipTrigger>
            <TooltipContent className="mb-2">
              Select a calendar where tatsu will store its todos. On initial sync, tatsu picks a random calendar to store its todo.
            </TooltipContent>
          </Tooltip>
        </span>
        <br/>
        {caldavCalendars.map((caldavCalendar, idx)=>{
          return (
            <div key={caldavCalendar.id}>
              <span className="flex justify-start items-center gap-2 hover:bg-accent p-2 rounded-sm cursor-pointer ">
                {caldavCalendar.selected==true || idx==0 && <Check className="w-5 h-5 text-lime"/>} <p>{caldavCalendar.name}</p>               
              </span>
              <LineSeparator className="mb-1"/>
            </div>
            )
          })}
      </div>
      
    </div>
  );
}
