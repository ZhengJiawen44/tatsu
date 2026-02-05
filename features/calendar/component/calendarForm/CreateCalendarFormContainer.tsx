import React from 'react'
import useWindowSize from '@/hooks/useWindowSize';
import dynamic from 'next/dynamic';
import ModalPlaceholder from '../loading/ModalPlaceholder';
import DrawerPlaceholder from '../loading/DrawerPlaceholder';
const MobileDrawer = dynamic(() => import("./Mobile/CreateCalendarDrawer"), { ssr: false, loading: () => <DrawerPlaceholder /> });
const DesktopModal = dynamic(() => import("./CreateCalendarForm"), { ssr: false, loading: () => <ModalPlaceholder /> });

type CreateCalendarFormContainerProps = {
    start: Date;
    end: Date;
    displayForm: boolean;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateCalendarFormContainer = ({
    start,
    end,
    displayForm,
    setDisplayForm,
}: CreateCalendarFormContainerProps) => {
    const { width } = useWindowSize();
    if (width > 1300) return <DesktopModal displayForm={displayForm} setDisplayForm={setDisplayForm} start={start} end={end} />
    return <MobileDrawer displayForm={displayForm} setDisplayForm={setDisplayForm} start={start} end={end} />
};

export default CreateCalendarFormContainer;







