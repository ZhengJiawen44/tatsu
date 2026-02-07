import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React, { useState, useMemo, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { useProjectMetaData } from '@/components/Sidebar/Project/query/get-project-meta';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import ProjectTag from '@/components/ProjectTag';
import { cn } from '@/lib/utils';

type ProjectDropdownMenuProp = {
    projectID: string | null;
    setProjectID: React.Dispatch<SetStateAction<string | null>>;
    className?: string;
    variant?: "default" | "noHash"
}

export default function ProjectDropdownMenu({ projectID, setProjectID, className, variant = "default" }: ProjectDropdownMenuProp) {
    const { projectMetaData } = useProjectMetaData();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');


    // Filter projects based on search input
    const filteredProjects = useMemo(() => {
        if (!search.trim()) return Object.entries(projectMetaData);
        const lowerSearch = search.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Object.entries(projectMetaData).filter(([_, value]) =>
            value.name.toLowerCase().includes(lowerSearch)
        );
    }, [search, projectMetaData]);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" type="button" className={cn("h-fit px-2! gap-1 text-muted-foreground font-normal", className)}>
                    {projectID
                        ?
                        <>
                            <ProjectTag id={projectID} className='text-sm pr-0' /> <>{projectMetaData[projectID]?.name}</>
                        </>
                        : <>
                            {variant == "default" && <span>#</span>}<p>Project</p>
                        </>
                    }
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-1 text-sm">
                <Input
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-[1.1rem]! md:text-base! lg:text-sm! w-full mb-1 bg-inherit brightness-75  outline-0 rounded-sm ring-0 ring-black focus-visible:ring-0 focus-visible:ring-offset-0"
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
                        <ProjectTag id={key} className='text-sm pr-0' /> {value.name}
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
