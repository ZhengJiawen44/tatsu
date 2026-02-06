import { cn } from "@/lib/utils";
import { SetStateAction, useMemo, useState } from "react";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import { Input } from "@/components/ui/input";
import ProjectTag from "@/components/ProjectTag";
type ProjectDrawerProps = {
    projectID: string | null,
    setProjectID: React.Dispatch<SetStateAction<string | null>>;
    className?: string;
};

export default function ProjectDrawer({
    projectID,
    setProjectID,
    className,
}: ProjectDrawerProps) {
    const { projectMetaData } = useProjectMetaData();
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
        <div className={cn("max-h-[92vh]", className)}>
            <div className="mx-auto w-full max-w-lg flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Frequency & Interval */}
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
                            data-close-on-click
                            key={key}
                            className='cursor-pointer p-1.5 rounded-sm hover:bg-accent/50'
                            onClick={() => {
                                setProjectID(key);
                            }}
                        >
                            <ProjectTag id={key} className='text-sm pr-0' /> {value.name}
                        </div>
                    ))}
                    {projectID != null &&
                        <>
                            <div
                                data-close-on-click
                                className='flex justify-center items-center border cursor-pointer p-1.5 rounded-sm hover:bg-red/40 hover:text-foreground! text-red'
                                onClick={() => {
                                    setProjectID(null);
                                }}
                            >
                                Clear
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>

    );
};
