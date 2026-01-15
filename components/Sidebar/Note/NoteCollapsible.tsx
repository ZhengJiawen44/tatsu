import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { useState } from "react";
import { useMenu } from "@/providers/MenuProvider";
import PlusCircle from "@/components/ui/icon/plusCircle";
import { useNote } from "@/features/notes/query/get-notes";
import NoteLoading from "./NoteLoading";
import { useCreateNote } from "@/features/notes/query/create-note";
import Spinner from "@/components/ui/spinner";
import NoteSidebarItem from "./NoteSidebarItem";
import { FileText } from "lucide-react";

const NoteCollapsible = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const [showPlus, setShowPlus] = useState(false);

  const { notes, isPending } = useNote(activeMenu.open);
  const { createNote, createLoading } = useCreateNote();
  return (
    <Collapsible
      className="w-full"
      open={activeMenu.open === true}
      onOpenChange={(open) => {
        setActiveMenu({ name: "Note", open });
      }}
    >
      <CollapsibleTrigger
        onMouseEnter={() => setShowPlus(true)}
        onMouseLeave={() => setShowPlus(false)}
        onClick={() => {}}
        className={clsx(
          "flex gap-3 justify-start items-center w-full py-3 px-3 rounded-lg hover:bg-popover border border-transparent",
          activeMenu.name === "Note" &&
            "bg-popover-accent shadow-md text-form-foreground-accent !border-border",
        )}
      >
        <FileText
          className={clsx(
            "w-5 h-5 stroke-muted-foreground",
            activeMenu.name === "Note" && "stroke-form-foreground-accent",
          )}
        />
        <p className="select-none">Note</p>
        {createLoading ? (
          <Spinner className="mr-0 ml-auto w-5 h-5" />
        ) : (
          showPlus && (
            <div
              className="mr-0 ml-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                createNote({ name: "new note" });
                setActiveMenu({ name: "Note", open: true });
              }}
            >
              <PlusCircle className="w-5 h-5 stroke-foreground hover:stroke-form-foreground-accent" />
            </div>
          )
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div>
          {isPending ? (
            <NoteLoading />
          ) : (
            notes.map((note) => <NoteSidebarItem note={note} key={note.id} />)
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NoteCollapsible;
