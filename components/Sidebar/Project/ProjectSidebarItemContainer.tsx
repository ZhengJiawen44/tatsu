import { useProjectMeta } from "./query/get-project-meta";
import React from "react";
import ProjectLoading from "./ProjectLoading";
import ProjectSidebarItem from "./ProjectSidebarItem";

export default function ProjectSidebarItemContainer() {
  const { projectMeta, isPending } = useProjectMeta();

  return (
    <div>
      {isPending ? (
        <ProjectLoading />
      ) : (
        projectMeta.map((meta) => {
          return <ProjectSidebarItem key={meta.id} meta={meta} />;
        })
      )}
    </div>
  );
}
