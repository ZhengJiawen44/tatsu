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
import { ProjectColor } from "@prisma/client";
import ProjectTag from "@/components/ProjectTag";

const ProjectSidebarItem = ({ meta }: { meta: Pick<ProjectItemType, "id" | "color" | "name"> }) => {
  const colors: { name: string; value: ProjectColor; tailwind: string }[] = [
    { name: "Red", value: "RED", tailwind: "bg-accent-red" },
    { name: "Orange", value: "ORANGE", tailwind: "bg-accent-orange" },
    { name: "Yellow", value: "YELLOW", tailwind: "bg-accent-yellow" },
    { name: "Lime", value: "LIME", tailwind: "bg-accent-lime" },
    { name: "Blue", value: "BLUE", tailwind: "bg-accent-blue" },
    { name: "Purple", value: "PURPLE", tailwind: "bg-accent-purple" },
    { name: "Pink", value: "PINK", tailwind: "bg-accent-pink" },
    { name: "Teal", value: "TEAL", tailwind: "bg-accent-teal" },
    { name: "Coral", value: "CORAL", tailwind: "bg-accent-coral" },
    { name: "Gold", value: "GOLD", tailwind: "bg-accent-gold" },
    { name: "Deep Blue", value: "DEEP_BLUE", tailwind: "bg-accent-deep-blue" },
    { name: "Rose", value: "ROSE", tailwind: "bg-accent-rose" },
    { name: "Light Red", value: "LIGHT_RED", tailwind: "bg-accent-light-red" },
    { name: "Brick", value: "BRICK", tailwind: "bg-accent-brick" },
    { name: "Slate", value: "SLATE", tailwind: "bg-accent-slate" },
  ];
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
    if (isRenaming === true && nameInput) {
      nameInput.focus();
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
        renameMutateFn({ id: meta.id, name });
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
      <div className="relative select-none">
        <Link
          href={`/app/project/${meta.id}`}
          className={clsx(
            "select-none flex gap-2 justify-between mt-2 pl-12 py-2 px-2 rounded-lg hover:bg-popover hover:cursor-pointer pr-2",
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
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              title={meta.name}
              className={clsx(
                "select-none outline-none flex justify-between w-[clamp(4rem,50%,10rem)] truncate bg-transparent",
              )}
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          ) : (
            <div className={clsx("flex justify-between items-center rounded-lg ")}>
              <ProjectTag id={meta.id} />{name}
            </div>
          )}
        </Link>

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
                    {colors.map((color) => (
                      <DropdownMenuItem
                        key={color.value}
                        onClick={() => recolorMutateFn({ id: meta.id, color: color.value })}
                      >
                        <span className={`w-5 h-5 ${color.tailwind} rounded-sm`}></span>
                        {color.name}
                      </DropdownMenuItem>
                    ))}
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


