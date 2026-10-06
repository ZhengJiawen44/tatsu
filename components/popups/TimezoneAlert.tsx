"use client"
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useUserTimezone } from "@/features/user/query/get-timezone"
import { useState } from "react"

export const TimezoneAlert = ()=>{
    const {userTimezone} = useUserTimezone()
    const [showDialog, setShowDialog] = useState(!Boolean(userTimezone))

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Alert</DialogTitle>
                </DialogHeader>
                <div>
                    <p>we could not get your timezone, this could be an issue on our part.</p>
                    <br/>
                    <p>To ensure proper functioning of the system, please manually set your timezone in the user menu</p>
                </div>
               
            </DialogContent>
        </Dialog>
    )
}