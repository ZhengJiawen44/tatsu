import { SetStateAction, useMemo, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalClose } from "./ui/Modal";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";

export default function KeyboardShortcuts({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [keyword, setKeyWord] = useState("");
  const shortcutsDict = useTranslations("shortcuts");
  const todoShortcuts = [
    { name: shortcutsDict("todo.submitAndOpen"), shortcutKey: ["Ctrl", "Enter"] },
    { name: shortcutsDict("todo.openForm"), shortcutKey: ["Q"] },
    { name: shortcutsDict("todo.editForm"), shortcutKey: ["Double Click"] },
  ];
  const calendarShortcuts = [
    { name: shortcutsDict("calendar.previous"), shortcutKey: ["←"] },
    { name: shortcutsDict("calendar.next"), shortcutKey: ["→"] },
    { name: shortcutsDict("calendar.todayView"), shortcutKey: ["T"] },
    { name: shortcutsDict("calendar.viewModes"), shortcutKey: ["1", "2", "3"] },
  ];
  const navigationShortcuts = [
    { name: shortcutsDict("navigation.today"), shortcutKey: ["G", "T"] },
    { name: shortcutsDict("navigation.calendar"), shortcutKey: ["G", "C"] },
    { name: shortcutsDict("navigation.completed"), shortcutKey: ["G", "D"] },
    { name: shortcutsDict("navigation.vault"), shortcutKey: ["G", "V"] },
  ]
  const searchList = useMemo(() => [...todoShortcuts, ...calendarShortcuts, ...navigationShortcuts].filter(({ name }) => { return name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) }), [keyword])


  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalOverlay>
        <ModalContent
          className="h-fit h-[90%] w-full max-w-xl overflow-scroll p-0 relative"
        >
          <ModalHeader className="mt-4 mx-6">
            <ModalTitle className="text-lg w-2/3 mx-auto">
              <div className="flex border items-center gap-2 bg-popover mb-10 px-2 rounded-md active:outline-1 focus:outline-1 ">
                <Search className="w-4 h-4" />
                <input
                  onInput={(e) => setKeyWord(e.currentTarget.value)}
                  className="w-full rounded-md outline-none py-2 text-base"
                  placeholder="Search shortcuts" />
              </div>
            </ModalTitle>
          </ModalHeader>
          <ModalClose className="absolute top-6 right-2 text-muted-foreground hover:text-foreground">
            <X />
          </ModalClose>


          <div className="max-w-4xl mx-auto p-6 bg-background">
            {
              keyword.length ?
                searchList.map(({ name, shortcutKey }) => <div key={name} className="shadow-md border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between">
                  <span>{name}</span>
                  <div className="flex gap-2">
                    {shortcutKey.map((key) =>
                      <span key={key} className="px-2 py-0.5 rounded-md bg-popover-accent/80">
                        {key}
                      </span>)}
                  </div>
                </div>)
                : <>
                  {/* Form Operations Table */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-2 pb-2">
                      {shortcutsDict("todo.title")}
                    </h2>
                    <div className="overflow-hidden rounded-lg">
                      {todoShortcuts.map(({ name, shortcutKey }) => {
                        return <div key={name} className="shadow-md border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between">
                          <span>{name}</span>
                          <div className="flex gap-2">
                            {shortcutKey.map((key) =>
                              <span key={key} className="px-2 py-0.5 rounded-md bg-popover-accent/80">
                                {key}
                              </span>)}
                          </div>
                        </div>
                      })}
                    </div>
                  </div>


                  {/* Calendar Table */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-2 pb-2">
                      {shortcutsDict("calendar.title")}
                    </h2>
                    <div className="overflow-hidden rounded-lg">
                      {calendarShortcuts.map(({ name, shortcutKey }) => {
                        return <div key={name} className="shadow-md border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between">
                          <span>{name}</span>
                          <div className="flex gap-2">
                            {shortcutKey.map((key) =>
                              <span key={key} className="px-2 py-0.5 rounded-md bg-popover-accent/80">
                                {key}
                              </span>)}
                          </div>
                        </div>
                      })}
                    </div>
                  </div>


                  {/* Navigation Table */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-2 pb-2">
                      {shortcutsDict("navigation.title")}
                    </h2>
                    <div className="overflow-hidden rounded-lg">
                      {navigationShortcuts.map(({ name, shortcutKey }) => {
                        return <div key={name} className="shadow-md border border-border/30 w-full rounded-sm bg-popover/60 mx-auto my-1 p-3 flex items-center justify-between">
                          <span>{name}</span>
                          <div className="flex gap-2">
                            {shortcutKey.map((key) =>
                              <span key={key} className="px-2 py-0.5 rounded-md bg-popover-accent/80">
                                {key}
                              </span>)}
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                </>
            }
          </div>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}