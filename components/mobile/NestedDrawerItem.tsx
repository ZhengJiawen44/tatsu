import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function NestedDrawerItem({
    icon,
    label,
    title,
    children,
    className
}: {
    icon: React.ReactNode;
    label: string | React.ReactNode;
    title?: string;
    children: React.ReactNode
    className?: string
}) {
    // Internal open state so we can programmatically close the nested drawer
    const [open, setOpen] = useState(false);

    // Close the nested drawer when an element inside DrawerContent with data-close-on-click is clicked.
    const handleContentClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest("[data-close-on-click]")) {
            setOpen(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button type="button" className={cn("flex items-center justify-between w-full p-4 hover:bg-accent/50 active:bg-accent transition-colors", className)}>
                    <div className="flex items-center gap-3">
                        {icon}
                        <span className="text-base font-medium">{title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">{label}</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] pb-8" onClick={handleContentClick}>
                <DrawerHeader>
                    <DrawerTitle className="hidden">{title}</DrawerTitle>
                </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    );
}