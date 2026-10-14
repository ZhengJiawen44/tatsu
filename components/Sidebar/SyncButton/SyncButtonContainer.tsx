import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useResyncCalDavAccount } from "@/features/calendarCredential/query/resync-calDavAccount";
import { useTranslations } from "next-intl";
import { useCalDavAccount } from "@/features/calendarCredential/query/get-calDavAccount";
import { useRouter } from "next/navigation";

export const SyncButtonContainer = () => {
  const { resyncMutateFn, resyncStatus } = useResyncCalDavAccount();
  const { calDavAccount } = useCalDavAccount();
  const router = useRouter();
  const sidebarDict = useTranslations("sidebar");
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => {
            if (calDavAccount) {
              resyncMutateFn();
            } else {
              router.push("/app/sync");
            }
          }}
          variant={"ghost"}
          className="h-12 w-12 flex items-center justify-center"
        >
          <RefreshCw
            className={
              "w-4 h-4 " + (resyncStatus === "pending" ? "animate-spin" : "")
            }
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="mb-1">{sidebarDict("resync")}</TooltipContent>
    </Tooltip>
  );
};
