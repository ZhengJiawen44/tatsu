import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { useState } from "react";
import Note from "@/components/ui/icon/note";
import { useMenu } from "@/providers/MenuProvider";
import PlusCircle from "@/components/ui/icon/plusCircle";
import CaretOutline from "@/components/ui/icon/caretOutline";
import { useNote } from "@/hooks/useNote";
import Link from "next/link";
import NoteLoading from "./NoteLoading";
import { useCreateNote } from "@/hooks/useNote";
import Spinner from "@/components/ui/spinner";

const NoteCollapsible = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const [showPlus, setShowPlus] = useState(false);

  const { notes, isPending } = useNote(activeMenu.open);
  const { createNote, createLoading } = useCreateNote({ onSuccess: () => {} });
  return (
    <Collapsible
      className="w-full"
      open={activeMenu.open}
      onOpenChange={(open) => {
        setActiveMenu({ name: "Note", open });
      }}
    >
      <CollapsibleTrigger
        onMouseEnter={() => setShowPlus(true)}
        onMouseLeave={() => setShowPlus(false)}
        onClick={() => {}}
        className={clsx(
          "flex gap-1 justify-start items-center w-full py-2 px-2 rounded-lg hover:bg-border-muted hover:bg-opacity-85 select-none",
          activeMenu.name === "Note" && "bg-border"
        )}
      >
        <CaretOutline
          className={clsx(
            "w-3 h-3 transition-transform duration-300 stroke-card-foreground",
            activeMenu.open && "rotate-90"
          )}
        />
        <Note className="w-5 h-5" />
        Note
        {createLoading ? (
          <Spinner className="mr-0 ml-auto w-5 h-5" />
        ) : (
          showPlus && (
            <div
              className="mr-0 ml-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                createNote({ name: "new note" });
              }}
            >
              <PlusCircle className="w-5 h-5 stroke-card-foreground hover:stroke-white" />
            </div>
          )
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div>
          {isPending ? (
            <NoteLoading />
          ) : (
            notes.map((note) => (
              <Link
                className={clsx(
                  "flex flex-col gap-2 mt-2",
                  activeMenu.children?.name === note.id &&
                    "bg-border-muted rounded-lg"
                )}
                key={note.id}
                href={`/app/note/${note.id}`}
                onClick={() =>
                  setActiveMenu({
                    name: "Note",
                    open: true,
                    children: { name: note.id },
                  })
                }
              >
                <div className="pl-12 py-2 px-2 rounded-lg hover:bg-border-muted hover:cursor-pointer ">
                  {note.name}
                </div>
              </Link>
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NoteCollapsible;
