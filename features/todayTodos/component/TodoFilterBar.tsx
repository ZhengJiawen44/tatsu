import React, { SetStateAction } from 'react'
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { X } from 'lucide-react';

type TodoFilterBarProps = {
    sortBy: string | undefined,
    setSortBy: React.Dispatch<SetStateAction<string | undefined>>
    groupBy: string | undefined,
    setGroupBy: React.Dispatch<SetStateAction<string | undefined>>
    direction: string,
    setDirection: React.Dispatch<SetStateAction<string>>
    containerHovered: boolean
}


export default function TodoFilterBar({ sortBy, groupBy, setSortBy, setGroupBy, direction, setDirection, containerHovered }: TodoFilterBarProps) {
    return (
        <div className="flex gap-2">
            <div className="flex flex-wrap gap-2 items-center">
                {groupBy &&
                    <div className="bg-border py-1.5 px-3  rounded-md flex items-center gap-2">
                        <span>{`Grouped by: ${groupBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => setGroupBy(undefined)}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {sortBy &&
                    <div className="bg-border py-1.5 px-3  rounded-md flex items-center gap-2">
                        <span>{`Sorted by: ${sortBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => setSortBy(undefined)}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {sortBy && <div className="bg-border py-1.5 px-3  rounded-md">{direction}</div>}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className={clsx("w-8 h-8 opacity-0", (containerHovered || sortBy || groupBy) && "opacity-100")}>
                            <ListFilter className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[200px]">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuLabel className="font-semibold">Sorting</DropdownMenuLabel>
                                <DropdownMenuSubTrigger>Sort</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                            value={sortBy}
                                            onValueChange={(value) => { setSortBy(value) }}
                                        >
                                            <DropdownMenuRadioItem value="Start date" className="hover:bg-popover-accent">
                                                Start date
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Deadline">
                                                Deadline
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Duration">
                                                Duration
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Priority">
                                                Priority
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Direction</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={direction}
                                                onValueChange={(value) => { setDirection(value) }}
                                            >
                                                <DropdownMenuRadioItem value="Descending">
                                                    Descending
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Ascending">
                                                    Ascending
                                                </DropdownMenuRadioItem>

                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="border-border" />
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuLabel className="font-semibold">Grouping</DropdownMenuLabel>
                                <DropdownMenuSubTrigger>Group</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                            value={groupBy}
                                            onValueChange={(value) => { setGroupBy(value) }}
                                        >
                                            <DropdownMenuRadioItem value="Start date" className="hover:bg-popover-accent">
                                                Start date
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Deadline">
                                                Deadline
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Duration">
                                                Duration
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Priority">
                                                Priority
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Recurrence">
                                                Recurrence
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="border-border" />
                        <DropdownMenuItem className="text-center justify-center text-red hover:bg-red/65" onClick={() => {
                            setSortBy(undefined);
                            setGroupBy(undefined);
                        }}>Clear all</DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            </div>
        </div>

    )
}
