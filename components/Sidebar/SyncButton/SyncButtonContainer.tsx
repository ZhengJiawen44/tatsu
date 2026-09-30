import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useResyncCalDavAccount } from "@/features/calendarCredential/query/resync-calDavAccount";

export const SyncButtonContainer = () => {
    const { resyncMutateFn, resyncStatus } = useResyncCalDavAccount();
    return <Tooltip>
        <TooltipTrigger asChild>
            <Button 
                onClick={()=>resyncMutateFn()}
                variant={"ghost"} className=" flex items-center justify-center"
            >
                <RefreshCw className={"w-4 h-4 " + (resyncStatus === "pending" ? "animate-spin" : "")}/>
            </Button>
        </TooltipTrigger>
        <TooltipContent className="mb-1">
            resync
        </TooltipContent>
    </Tooltip>
       
}