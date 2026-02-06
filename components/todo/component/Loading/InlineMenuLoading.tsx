import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function InlineMenuLoading() {
    return (
        <div className='hidden sm:flex w-fit px-3 gap-4'>
            <Skeleton className='w-5 h-5 rounded-sm bg-popover-accent' />
            <Skeleton className='w-5 h-5 rounded-sm bg-popover-accent' />
            <Skeleton className='w-5 h-5 rounded-sm bg-popover-accent' />
        </div>
    )
}
