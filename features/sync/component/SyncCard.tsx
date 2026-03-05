import { Button } from '@/components/ui/button'
import { RefreshCcw, Unlink } from 'lucide-react'
import React from 'react'
import { useCalDavAccount } from '../../calendarCredential/query/get-calDavAccount';
import { useDeleteCalDavAccount } from '../../calendarCredential/query/delete-calDavAccount';

export default function SyncCard() {
    const { calDavAccount } = useCalDavAccount();
    const { deleteMutateFn } = useDeleteCalDavAccount();
    return (
        <div className="border rounded-md bg-card p-4 pt-8 w-full mb-8">
            <div className="flex gap-4 justify-between items-center">
                <p className="text-2xl">
                    <span className="text-muted-foreground text-xs">Synced to</span> {"  "}
                    <span>{calDavAccount?.service || "Nothing"}</span>
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" className=""><RefreshCcw className="w-4 h-4" />Resync</Button>
                    <Button variant="destructive"
                        onClick={() => { deleteMutateFn() }} >
                        <Unlink className="w-4 h-4" />
                        Unsync
                    </Button>

                </div>

            </div>


        </div>
    )
}
