import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { useState } from "react";
import { useMenu } from "@/providers/MenuProvider";
import PlusCircle from "@/components/ui/icon/plusCircle";
import { useCreateProject } from "./query/create-project";
import Spinner from "@/components/ui/spinner";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import ProjectLoading from "./ProjectLoading";
const ProjectSidebarItemContainer = dynamic(
  () => import("./ProjectSidebarItemContainer"),
  { loading: () => <ProjectLoading /> },
);

const ProjectCollapsible = () => {

  const { activeMenu, setActiveMenu } = useMenu();
  const [showPlus, setShowPlus] = useState(false);

  const { createMutateFn, createLoading } = useCreateProject();
  return (
    <Collapsible
      className="w-full"
      open={activeMenu.open === true}
      onOpenChange={(open) => {
        setActiveMenu({ name: "Project", open });
      }}
    >
      <CollapsibleTrigger
        onMouseEnter={() => setShowPlus(true)}
        onMouseLeave={() => setShowPlus(false)}
        asChild
        className={clsx("w-full items-start justify-start")}
      >
        <Button
          variant={"ghost"}
          className={clsx(
            "flex gap-3 items-center border border-transparent w-full font-normal",
            activeMenu.name === "Project" &&
            "bg-sidebar-primary shadow-md text-form-foreground-accent !border-border",
          )}
        >
          <Folder
            className={clsx(
              "w-5 h-5 stroke-muted-foreground",
              activeMenu.name === "Project" && "stroke-form-foreground-accent",
            )}
          />
          <p className="select-none text-foreground">Project</p>
          {createLoading ? (
            <Spinner className="mr-0 ml-auto w-5 h-5" />
          ) : (
            showPlus && (
              <div
                className="mr-0 ml-auto"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  createMutateFn({ name: "new Project" });
                  setActiveMenu({ name: "Project", open: true });
                }}
              >
                <PlusCircle className="w-5 h-5 stroke-muted-foreground hover:stroke-foreground" />
              </div>
            )
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {activeMenu.open && <ProjectSidebarItemContainer />}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProjectCollapsible;
