import React from 'react'
import { ArrowUpWideNarrowIcon } from "lucide-react";
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
import { SortBy, GroupBy } from '@prisma/client';
import { useUserPreferences } from '@/providers/UserPreferencesProvider';
import { useTranslations } from 'next-intl';

type TodoFilterBarProps = {
    containerHovered: boolean
}
export default function TodoFilterBar({ containerHovered }: TodoFilterBarProps) {
    const filterDict = useTranslations("filterMenu");
    const appDict = useTranslations("app");

    const { updatePreferences, preferences } = useUserPreferences();
    return (
        <div className='flex w-full justify-between'>
            <div className="flex gap-2 items-center flex-wrap">
                {preferences?.groupBy &&
                    <div className="bg-sidebar border py-1.5 px-3  rounded-md flex items-center gap-2 shrink-0">
                        <span>{`${filterDict("groupedBy")}: ${preferences.groupBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => updatePreferences({ groupBy: undefined })}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {preferences?.sortBy &&
                    <div className="bg-sidebar border py-1.5 px-3  rounded-md flex items-center gap-2 shrink-0">
                        <span>{`${filterDict("sortedBy")}: ${preferences.sortBy}`}</span>
                        <span className="hover:text-lime cursor-pointer w-4 text-center"
                            onClick={() => updatePreferences({ sortBy: undefined })}>
                            <X className='w-4 h-4' />
                        </span>
                    </div>}
                {preferences?.sortBy && <div className="bg-sidebar border py-1.5 px-3  rounded-md">{filterDict(preferences.direction?.toLowerCase() || "ascending")}</div>}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className={clsx("w-8 h-8 opacity-0 border", (containerHovered || preferences?.sortBy || preferences?.groupBy) && "opacity-100")}>
                        <ArrowUpWideNarrowIcon className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-50">
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuLabel className="font-semibold">{filterDict("sorting")}</DropdownMenuLabel>
                            <DropdownMenuSubTrigger>{filterDict("sort")}</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup
                                        value={preferences?.sortBy || undefined}
                                        onValueChange={(value) => {
                                            updatePreferences({ sortBy: value as SortBy });

                                        }}
                                    >
                                        <DropdownMenuRadioItem value="dtstart" className="hover:bg-popover-accent">
                                            {filterDict("start Date")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="due">
                                            {filterDict("deadline")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="duration">
                                            {filterDict("duration")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priority">
                                            {appDict("priority")}
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>{filterDict("direction")}</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                            value={preferences?.direction || undefined}
                                            onValueChange={(value) => {
                                                if (value == "Ascending" || value == "Descending")
                                                    updatePreferences({ direction: value });
                                            }}
                                        >
                                            <DropdownMenuRadioItem value="Descending">
                                                {filterDict("descending")}
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Ascending">
                                                {filterDict("ascending")}
                                            </DropdownMenuRadioItem>

                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='my-3' />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuLabel className="font-semibold">{filterDict("grouping")}</DropdownMenuLabel>
                            <DropdownMenuSubTrigger>{filterDict("group")}</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup
                                        value={preferences?.groupBy || undefined}
                                        onValueChange={(value) => {
                                            updatePreferences({ groupBy: value as GroupBy });
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="dtstart" className="hover:bg-popover-accent">
                                            {filterDict("start Date")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="due">
                                            {filterDict("deadline")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="duration">
                                            {filterDict("duration")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priority">
                                            {appDict("priority")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="rrule">
                                            {filterDict("recurrence")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="project" className="hover:bg-popover-accent">
                                            {appDict("project")}
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='my-3' />
                    <DropdownMenuItem
                        className="text-center justify-center text-red hover:bg-red/65"
                        onClick={() => {
                            updatePreferences({ groupBy: undefined, sortBy: undefined, direction: undefined })
                        }}>{appDict("clear")}
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>

    )
}
