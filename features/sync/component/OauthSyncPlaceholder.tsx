import Spinner from "@/components/ui/spinner"

export const OauthSyncPlaceholder = ()=>{
    return(
        <>
            <div className="fixed bg-black opacity-50 w-full h-full top-0 left-0"/>
            <div className=" p-4 flex flex-col gap-4 justify-center items-center bg-background w-fit h-30 rounded-md fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
            <Spinner className="w-10 h-10"/>
            Sync in progress
            </div>
        </>
    )
}