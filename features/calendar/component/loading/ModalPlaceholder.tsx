import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { createPortal } from 'react-dom'

export default function ModalPlaceholder() {
    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-popover rounded-lg w-full max-w-lg p-6">
                <div
                    className="flex min-w-0 flex-col gap-5 mt-4"
                >
                    {/* Title */}
                    <Skeleton className="h-12 w-full bg-popover-accent" />

                    {/* Date */}
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-full bg-popover-accent" />
                        </div>
                    </div>

                    <div className="flex gap-7 sm:flex-col sm:gap-4">
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

                    {/* Description */}
                    <div className="flex items-start gap-4">
                        <Skeleton className="flex-1 h-20 min-w-0 bg-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime" />
                    </div>

                    {/* Actions */}
                    <div className='flex gap-4 justify-end'>
                        <Skeleton className='w-20 h-8 bg-popover-accent' />
                        <Skeleton className='w-20 h-8 bg-popover-accent' />
                    </div>
                </div>
            </div>
        </div>
        ,
        document.body
    )
}
