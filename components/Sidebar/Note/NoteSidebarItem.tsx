import {
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { useDeleteNote } from "@/features/notes/api/delete-note";
import { useRenameNote } from "@/features/notes/api/rename-note";
import { useMenu } from "@/providers/MenuProvider";
import { NoteItemType } from "@/types";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/spinner";
import Meatball from "@/components/ui/icon/meatball";
import useWindowSize from "@/hooks/useWindowSize";

const NoteSidebarItem = ({ note }: { note: NoteItemType }) => {
  const { renameMutate } = useRenameNote();
  const { width } = useWindowSize();
  //states for renaming
  const [name, setName] = useState(note.name);

  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { deleteMutate, deleteLoading } = useDeleteNote();

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
        renameMutate({ id: note.id, name });
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (nameInput && !nameInput.contains(e.target as Node)) {
        setIsRenaming(false);
        renameMutate({ id: note.id, name });
      }
    }
    document.addEventListener("keydown", onEnterKeyPress);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onEnterKeyPress);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [note.id, renameMutate, name, isRenaming]);

  return (
    <>
      <div className="relative select-none">
        <Link
          href={`/app/note/${note.id}`}
          className={clsx(
            "select-none flex gap-2 justify-between mt-2 pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer pr-2",
            activeMenu.children?.name === note.id && "bg-border-muted"
          )}
          onClick={() => {
            setActiveMenu({
              name: "Note",
              open: true,
              children: { name: note.id },
            });
            if (width <= 766) setShowMenu(false);
          }}
        >
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              title={note.name}
              className={clsx(
                "select-none outline-none flex justify-between w-[clamp(4rem,50%,10rem)] truncate bg-transparent"
              )}
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          ) : (
            <div className={clsx("flex justify-between  rounded-lg ")}>
              {name}
            </div>
          )}
        </Link>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex px-2">
          {deleteLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <MenuContainer>
              <MenuTrigger>
                <Meatball className="w-5 h-5" />
              </MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => setIsRenaming(true)}>rename</MenuItem>
                <MenuItem onClick={() => deleteMutate({ id: note.id })}>
                  delete
                </MenuItem>
              </MenuContent>
            </MenuContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteSidebarItem;
