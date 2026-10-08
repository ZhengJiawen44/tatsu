import { Button } from "@/components/ui/button";
import {RefreshCw, Unlink } from "lucide-react";
import React from "react";
import { useCalDavAccount } from "../../calendarCredential/query/get-calDavAccount";
import { useDeleteCalDavAccount } from "../../calendarCredential/query/delete-calDavAccount";
import { useResyncCalDavAccount } from "../../calendarCredential/query/resync-calDavAccount";
import { useTranslations } from "next-intl";
import CaldavCalendarTable from "@/features/caldavCalendar/components/CaldavCalendarTable";

export default function SyncCard() {
  const t = useTranslations("sync");
  const { calDavAccount } = useCalDavAccount();
  const { deleteMutateFn } = useDeleteCalDavAccount();
  const { resyncMutateFn, resyncStatus } = useResyncCalDavAccount();
  return (
    <div className="border rounded-md bg-background w-full mb-9 pb-2">
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
      <CaldavCalendarTable/>
    </div>
  );
}
