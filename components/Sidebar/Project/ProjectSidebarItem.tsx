import { useDeleteProject } from "./query/delete-project";
import { useRenameProject } from "./query/rename-project";
import { useMenu } from "@/providers/MenuProvider";
import { ProjectItemType } from "@/types";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/spinner";
import Meatball from "@/components/ui/icon/meatball";
import useWindowSize from "@/hooks/useWindowSize";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { useRecolorProject } from "./query/update-project-color";
import { projectColorMap } from "@/lib/projectColorMap";
import ProjectTag from "@/components/ProjectTag";

const ProjectSidebarItem = ({ meta }: { meta: Pick<ProjectItemType, "id" | "color" | "name"> }) => {
  const { renameMutateFn } = useRenameProject();
  const { recolorMutateFn } = useRecolorProject();
  const { width } = useWindowSize();
  //states for renaming
  const [name, setName] = useState(meta.name);

  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { deleteMutateFn, deleteLoading } = useDeleteProject();
  //focus name input on isRenaming
  useEffect(() => {
    const nameInput = inputRef.current;

    if (isRenaming && nameInput) {
      setTimeout(() => nameInput.select(), 300)
    }
  }, [isRenaming]);


  //rename on click outside or enter key
  useEffect(() => {
    const nameInput = inputRef.current;

    function onEnterKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && isRenaming) {
        setIsRenaming(false);
        renameMutateFn({ id: meta.id, name });
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (nameInput && !nameInput.contains(e.target as Node)) {
        setIsRenaming(false);
      }
    }
    document.addEventListener("keydown", onEnterKeyPress);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onEnterKeyPress);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [meta.id, renameMutateFn, name, isRenaming]);

  return (
    <>
      <div className="relative ">
        {isRenaming ? (
          <div className="flex justify-between items-center rounded-lg pl-7 py-1 px-2 mt-2">
            <ProjectTag id={meta.id} />
            <input
              ref={inputRef}
              type="text"
              title={meta.name}
              className="select-text border w-full outline-none flex justify-between h-full ring-1 truncate bg-transparent"

              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <Link
            href={`/app/project/${meta.id}`}
            className={clsx(
              "select-none flex gap-2 justify-between mt-2 pl-7 py-1 px-2 rounded-lg hover:bg-popover hover:cursor-pointer pr-2",
              activeMenu.children?.name === meta.id && "bg-popover",
            )}
            onClick={() => {
              setActiveMenu({
                name: "meta",
                open: true,
                children: { name: meta.id },
              });
              if (width <= 766) setShowMenu(false);
            }}
          >
            <div className="flex justify-between items-center rounded-lg">
              <ProjectTag id={meta.id} />
              {meta.name}
            </div>
          </Link>
        )}


        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex px-2">
          {deleteLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Meatball className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsRenaming(true)}> rename</DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteMutateFn({ id: meta.id })}>
                  delete
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Edit colours...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="max-h-[15rem] overflow-scroll">
                    {projectColorMap.map((color) => {
                      // map ProjectColor values to static Tailwind classes
                      const colorClassMap: Record<string, string> = {
                        RED: "bg-accent-red",
                        ORANGE: "bg-accent-orange",
                        YELLOW: "bg-accent-yellow",
                        LIME: "bg-accent-lime",
                        BLUE: "bg-accent-blue",
                        PURPLE: "bg-accent-purple",
                        PINK: "bg-accent-pink",
                        TEAL: "bg-accent-teal",
                        CORAL: "bg-accent-coral",
                        GOLD: "bg-accent-gold",
                        DEEP_BLUE: "bg-accent-deep-blue",
                        ROSE: "bg-accent-rose",
                        LIGHT_RED: "bg-accent-light-red",
                        BRICK: "bg-accent-brick",
                        SLATE: "bg-accent-slate",
                      };

                      const bgClass = colorClassMap[color.value];

                      return (
                        <DropdownMenuItem
                          key={color.value}
                          onClick={() => recolorMutateFn({ id: meta.id, color: color.value })}
                        >
                          <span
                            className={`w-5 h-5 ${bgClass} border border-popover-border rounded-sm`}
                          ></span>
                          {color.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>

                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectSidebarItem;


