import React from 'react'
import useWindowSize from '@/hooks/useWindowSize';
import dynamic from 'next/dynamic';
import { TodoItemType } from '@/types';
import ModalPlaceholder from '../loading/ModalPlaceholder';
import DrawerPlaceholder from '../loading/DrawerPlaceholder';
const MobileDrawer = dynamic(() => import("./Mobile/EditCalendarDrawer"), { ssr: false, loading: () => <DrawerPlaceholder /> });
const DesktopModal = dynamic(() => import("./EditCalendarForm"), { ssr: false, loading: () => <ModalPlaceholder /> },);

type CreateCalendarFormContainerProps = {
    todo: TodoItemType
    displayForm: boolean;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateCalendarFormContainer = ({
    todo,
    displayForm,
    setDisplayForm,
}: CreateCalendarFormContainerProps) => {
    const { width } = useWindowSize();
    if (width > 1300) return <DesktopModal displayForm={displayForm} setDisplayForm={setDisplayForm} todo={todo} />
    return <MobileDrawer displayForm={displayForm} setDisplayForm={setDisplayForm} todo={todo} />
};

export default CreateCalendarFormContainer;







