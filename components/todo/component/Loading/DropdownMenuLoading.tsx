import Spinner from '@/components/ui/spinner'
import React from 'react'

export default function DropdownMenuLoading() {
    return (
        <div className='flex justify-center items-center h-20'>
            <Spinner className='w-6! h-6!' />
        </div>
    )
}
