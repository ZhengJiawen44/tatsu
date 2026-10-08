import LineSeparator from "@/components/ui/lineSeparator";


export function CaldavCalendarTablePlaceholder(){
    return (
            <>
                <span className="h-9 flex justify-start items-center gap-2 animate-pulse bg-accent p-2 rounded-sm cursor-pointer"/>
                <LineSeparator className="mb-1"/>
                
                 <span className="h-9 flex justify-start items-center gap-2 animate-pulse bg-accent p-2 rounded-sm cursor-pointer"/>          
                <LineSeparator className="mb-1"/>

                 <span className="h-9 flex justify-start items-center gap- animate-pulse bg-accent p-2 rounded-sm cursor-pointer"/>            
                <LineSeparator className="mb-1"/>

                 <span className="h-9 flex justify-start items-center gap-2 animate-pulse bg-accent p-2 rounded-sm cursor-pointer"/>            
                <LineSeparator className="mb-1"/>
            </>   
            )
}