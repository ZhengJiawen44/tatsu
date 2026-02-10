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
import { useTranslations } from "next-intl";

export default function ProjectDrawer({
    projectID,
    setProjectID,
    className,
}: ProjectDrawerProps) {
    const appDict = useTranslations("app")
    const projectDict = useTranslations("projectMenu")

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
            <div className="mx-auto w-full max-w-lg flex flex-col h-full gap-4">
                {/* Frequency & Interval */}
                <Input
                    placeholder={projectDict("typeToSearch")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-base! w-full mb-4 bg-inherit border-popover-border focus:brightness-100 brightness-75 outline-0 rounded-sm ring-0 ring-black focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            {appDict("clear")}
                        </div>
                    </>
                }
            </div>
        </div>

    );
};
