
import useWindowSize from '@/hooks/useWindowSize';
import dynamic from 'next/dynamic';
import React from 'react'
const MobileDrawer = dynamic(() => import("@/features/calendar/component/CalendarForm/FormFields/Drawers/RepeatDrawer/CustomRepeatDrawer"), { ssr: false });
const DesktopModal = dynamic(() => import("./repeatModalMenu/CutomRepeatModalMenu"), { ssr: false, loading: () => <Skeleton className='h-7 w-full bg-popover-accent rounded-md' /> });
import { useTodoForm } from '@/providers/TodoFormProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomRepeatMenuContainer() {
    const { rruleOptions, setRruleOptions, derivedRepeatType } = useTodoForm();
    const { width } = useWindowSize();
    if (width > 1300) return <DesktopModal className="flex w-full text-sm hover:bg-popover-accent cursor-pointer justify-between p-1.5 px-2" />
    return <MobileDrawer rruleOptions={rruleOptions} setRruleOptions={setRruleOptions} derivedRepeatType={derivedRepeatType} />
}
