import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function ModalTest() {
    return (
        <div className="flex justify-center items-center mt-16">
            {/* MAIN BUTTON */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Open Menu</Button>
                </DialogTrigger>

                {/* DIALOG */}
                <DialogContent className="shadow-light100_dark100 bg-tertiary-light-dark border-none p-4">
                    <DialogHeader>
                        <DialogTitle>Menu Dialog</DialogTitle>
                    </DialogHeader>

                    {/* DROPDOWN INSIDE DIALOG */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Open Dropdown</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="shadow-light100_dark100 bg-tertiary-light-dark border-none p-2">
                            <DropdownMenuItem>Item One</DropdownMenuItem>

                            {/* SUB DROPDOWN */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    More Options
                                </DropdownMenuSubTrigger>

                                <DropdownMenuSubContent className="shadow-light100_dark100 bg-tertiary-light-dark border-none p-2">
                                    <DropdownMenuItem>Sub Item A</DropdownMenuItem>
                                    <DropdownMenuItem>Sub Item B</DropdownMenuItem>
                                    <DropdownMenuItem>Sub Item C</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuItem>Item Two</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </DialogContent>
            </Dialog>
        </div>
    );
}
