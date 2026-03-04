import { Button } from '@/components/ui/button'
import { RefreshCcw, Unlink } from 'lucide-react'
import React, { SetStateAction } from 'react'

type SyncCardProp = {
    syncedTo: string;
    setSyncedTo: React.Dispatch<SetStateAction<string>>
}

export default function SyncCard({ syncedTo, setSyncedTo }: SyncCardProp) {
    return (
        <div className="border rounded-md bg-card p-4 pt-8 w-full mb-8">
            <div className="flex gap-4 justify-between items-center">
                <p className="text-2xl">
                    <span className="text-muted-foreground text-xs">Synced to</span> {"  "}
                    {syncedTo}
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" className=""><RefreshCcw className="w-4 h-4" />Resync</Button>
                    <Button variant="destructive"
                        onClick={() => { setSyncedTo("None") }} >
                        <Unlink className="w-4 h-4" />
                        Unsync
                    </Button>

                </div>

            </div>


        </div>
    )
}
