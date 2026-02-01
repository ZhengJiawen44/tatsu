import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useTodoForm } from '@/providers/TodoFormProvider';
import { useProjectMetaData } from '@/components/Sidebar/Project/query/get-project-meta';
import LineSeparator from '@/components/ui/lineSeparator';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export default function ProjectDropdownMenu() {
    const { projectID, setProjectID } = useTodoForm();
    const { projectMetaData } = useProjectMetaData();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const projectColor = useMemo(() => {
        if (!projectID) return null;
        return projectMetaData[projectID].color;
    }, [projectID])

    // Filter projects based on search input
    const filteredProjects = useMemo(() => {
        if (!search.trim()) return Object.entries(projectMetaData);
        const lowerSearch = search.toLowerCase();
        return Object.entries(projectMetaData).filter(([_, value]) =>
            value.name.toLowerCase().includes(lowerSearch)
        );
    }, [search, projectMetaData]);

    return (
        <Popover modal={false} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" type="button" className="h-8 !px-2 gap-1 text-muted-foreground">
                    <span className={projectColor ? `text-${projectColor}` : 'text-lime'}>#</span> {projectID ? projectMetaData[projectID]?.name : "Project"}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-1 text-sm">
                <Input
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="!text-[1.1rem] md:!text-base lg:!text-sm w-full mb-1 bg-inherit brightness-75  outline-0 rounded-sm ring-0 ring-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => e.stopPropagation()}
                    autoFocus
                />
                {filteredProjects.length === 0 && (
                    <p className='text-xs text-muted-foreground py-10 text-center w-full'>
                        No projects...
                    </p>
                )}
                {filteredProjects.map(([key, value]) => (
                    <div
                        key={key}
                        className='cursor-pointer p-1.5 rounded-sm hover:bg-popover-accent'
                        onClick={() => {
                            setProjectID(key);
                            setOpen(false);
                        }}
                    >
                        <span className={projectColor ? `text-${projectColor}` : 'text-lime'}>#</span> {value.name}
                    </div>
                ))}

                {projectID &&
                    <>
                        <DropdownMenuSeparator />
                        <div
                            className='cursor-pointer p-1.5 rounded-sm hover:bg-red/40'
                            onClick={() => {
                                setProjectID(null);
                                setOpen(false);
                            }}
                        >
                            remove
                        </div>
                    </>
                }
            </PopoverContent>
        </Popover>
    );
}
