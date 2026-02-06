import clsx from "clsx";
import React from "react";
import PlusCircle from "@/components/ui/icon/plusCircle";
import { useCreateProject } from "./query/create-project";
import Spinner from "@/components/ui/spinner";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectLoading from "./ProjectLoading";
import { useProjectMetaData } from "./query/get-project-meta";
import ProjectSidebarItem from "./ProjectSidebarItem";


const ProjectCollapsible = () => {
  const { projectMetaData, isPending } = useProjectMetaData();
  const { createMutateFn, createLoading } = useCreateProject();
  return (
    <div
      className="group w-full"
    >
      <div
        className={clsx("w-full items-start justify-start ")}
      >
        <div
          className={clsx(
            "flex gap-3 items-center pl-5 pr-3! w-full h-11 font-normal hover:bg-inherit cursor-default",
          )}
        >
          <Folder
            className={clsx(
              "w-5 h-5 stroke-muted-foreground",
            )}
          />
          <p className="select-none text-foreground">Project</p>
          {createLoading ? (
            <Spinner className="mr-0 ml-auto w-5 h-5" />
          ) : (

            <div
              className="mr-0 ml-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                createMutateFn({ name: "new Project" });
              }}
            >
              <Button size={"icon"} className="w-fit h-fit p-1 bg-inherit hover:bg-popover-accent cursor-pointer! text-muted-foreground hover:text-foreground hidden group-hover:flex">
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>

          )}
        </div>
      </div>
      <div>
        <div>
          {isPending ? (
            <ProjectLoading />
          ) : (
            Object.entries(projectMetaData).map(([key, value]) => {
              return <ProjectSidebarItem key={key} meta={{ id: key, ...value }} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCollapsible;
