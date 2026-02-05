import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { createPortal } from 'react-dom'

export default function DrawerPlaceholder() {
    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
            <div className="rounded-lg w-full h-[65vh] sm:h-[57vh] p-3 bg-background flex items-center rounded-tr-lg rounded-tl-lg border">
                <div
                    className="w-full h-full max-w-lg flex flex-col m-auto gap-0 p-0"
                >
                    {/* drag handle */}
                    <div className='w-24 bg-muted h-2 rounded-full mx-auto mt-0' />

                    {/* Title */}
                    <Skeleton className="h-8 w-[80vw] bg-popover-accent my-5 mx-auto" />

                    <div className='rounded-md p-4 border flex flex-col gap-7 mb-8'>

                        {/* Date */}
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <Skeleton className="h-8 w-full bg-popover-accent" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-7">
                            {/* Repeat */}
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <Skeleton className="h-8 w-20 bg-popover-accent" />
                                </div>
                            </div>

                            {/* Project */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Skeleton className="h-8 w-20 bg-popover-accent" />
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <Skeleton className="h-8 w-20 bg-popover-accent" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Description */}
                    <div className="flex items-start gap-4 mb-8">
                        <Skeleton className="w-full h-28 min-w-0 bg-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime" />
                    </div>

                    {/* Actions */}
                    <div className='flex gap-4 justify-center'>
                        <Skeleton className='flex-1 w-full h-10 bg-popover-accent' />
                        <Skeleton className='flex-1 w-full h-10 bg-popover-accent' />
                    </div>
                </div>
            </div>
        </div>
        ,
        document.body
    )
}
