import React from 'react'
import useWindowSize from '@/hooks/useWindowSize';
import dynamic from 'next/dynamic';
import { TodoItemType } from '@/types';
import ModalPlaceholder from '../LoadingPlaceholders/ModalPlaceholder';
import DrawerPlaceholder from '../LoadingPlaceholders/DrawerPlaceholder';
const MobileDrawer = dynamic(() => import("./Form/DrawerForm/EditDrawer"), { ssr: false, loading: () => <DrawerPlaceholder /> });
const DesktopModal = dynamic(() => import("./Form/ModalForm/EditModal"), { ssr: false, loading: () => <ModalPlaceholder /> },);

type EditCalendarFormContainerProps = {
    todo: TodoItemType
    displayForm: boolean;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCalendarFormContainer = ({
    todo,
    displayForm,
    setDisplayForm,
}: EditCalendarFormContainerProps) => {
    const { width } = useWindowSize();
    if (width > 1300) return <DesktopModal displayForm={displayForm} setDisplayForm={setDisplayForm} todo={todo} />
    return <MobileDrawer displayForm={displayForm} setDisplayForm={setDisplayForm} todo={todo} />
};

export default EditCalendarFormContainer;







