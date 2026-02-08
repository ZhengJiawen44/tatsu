import React from 'react'
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
import { SortBy, GroupBy, Direction } from '@prisma/client';
import { useUserPreferences } from '@/providers/UserPreferencesProvider';

type TodoFilterBarProps = {
    containerHovered: boolean
}


export default function TodoFilterBar({ containerHovered }: TodoFilterBarProps) {
    const { updatePreferences, preferences } = useUserPreferences();
    return (
        <div className="flex justify-between ">
            <div className="flex flex-wrap gap-2 items-center">
                {preferences?.groupBy &&
                    <div className="bg-sidebar border py-1.5 px-3  rounded-md flex items-center gap-2">
                        <span>{`Grouped by: ${preferences.groupBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => updatePreferences({ groupBy: undefined })}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {preferences?.sortBy &&
                    <div className="bg-sidebar border py-1.5 px-3  rounded-md flex items-center gap-2">
                        <span>{`Sorted by: ${preferences.sortBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => updatePreferences({ sortBy: undefined })}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {preferences?.sortBy && <div className="bg-sidebar border py-1.5 px-3  rounded-md">{preferences.direction}</div>}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className={clsx("w-8 h-8 opacity-0", (containerHovered || preferences?.sortBy || preferences?.groupBy) && "opacity-100")}>
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
                                        value={preferences?.sortBy || undefined}
                                        onValueChange={(value) => {
                                            updatePreferences({ sortBy: value as SortBy });

                                        }}
                                    >
                                        <DropdownMenuRadioItem value="dtstart" className="hover:bg-popover-accent">
                                            Start date
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="due">
                                            Deadline
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="duration">
                                            Duration
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priority">
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
                                            value={preferences?.direction || undefined}
                                            onValueChange={(value) => {
                                                updatePreferences({ direction: value as Direction });
                                            }}
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
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuLabel className="font-semibold">Grouping</DropdownMenuLabel>
                            <DropdownMenuSubTrigger>Group</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup
                                        value={preferences?.groupBy || undefined}
                                        onValueChange={(value) => {
                                            updatePreferences({ groupBy: value as GroupBy });
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="dtstart" className="hover:bg-popover-accent">
                                            Start date
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="due">
                                            Deadline
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="duration">
                                            Duration
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priority">
                                            Priority
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="rrule">
                                            Recurrence
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='my-2' />
                    <DropdownMenuItem
                        className="text-center justify-center text-red hover:bg-red/65"
                        onClick={() => {
                            updatePreferences({ groupBy: undefined, sortBy: undefined, direction: undefined })
                        }}>Clear all
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>

    )
}
