import React, { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'

const ModalContext = createContext<{
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
} | null>(null);


const Modal = ({
    open: controlledOpen,
    onOpenChange,
    children
}: {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    children: React.ReactNode
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    // 2. Determine if we are controlled or not
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    // 3. Unified change handler
    const handleOpenChange = (value: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(value);
        }
        onOpenChange?.(value);
    };

    return (
        <ModalContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
            {children}
        </ModalContext.Provider>
    );
};


const ModalOverlay = ({ children }: { children: React.ReactElement }) => {

    const context = useContext(ModalContext);

    if (!context) throw new Error("ModalOverlay must be used within a Modal");
    const { isOpen, setIsOpen } = context;

    if (!isOpen) return null;
    return createPortal(

        <div
            className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    e.preventDefault();
                    e.stopPropagation();
                    // defer close to avoid click-through
                    requestAnimationFrame(() => setIsOpen(false));
                }
            }}
        >
            {children}
        </div>
        , document.body
    )

}

const ModalContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="bg-background rounded-lg w-full max-w-lg p-6"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    )
}


const ModalHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
        {children}
    </div>
);

const ModalTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h2>
);

const ModalDescription = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <p className={`text-sm text-muted-foreground ${className}`}>
        {children}
    </p>
);

const ModalFooter = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 ${className}`} >
        {children}
    </div>
);

export { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalOverlay, ModalTitle }


