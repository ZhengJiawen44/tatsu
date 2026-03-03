import { Button } from '@/components/ui/button'
import { RefreshCcw, Unlink } from 'lucide-react'
import React from 'react'

export default function SyncCard() {
    return (

        <div className="border rounded-md bg-card p-4 w-full mb-8">
            <h3>Sync to calendar</h3>
            <div className="ml-auto w-fit">
                <div className="flex gap-4 justify-center items-center">

                    <p className="text-xl">
                        <span className="text-muted-foreground text-xs">Synced to</span> {"  "}
                        Google calendar</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className=""><RefreshCcw className="w-4 h-4" />Resync</Button>
                        <Button variant="destructive"><Unlink className="w-4 h-4" /> Unsync</Button>

                    </div>

                </div>

            </div>
        </div>
    )
}
