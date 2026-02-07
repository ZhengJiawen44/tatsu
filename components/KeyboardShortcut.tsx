import { SetStateAction } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalTitle } from "./ui/Modal";
import { useTranslations } from "next-intl";

export default function KeyboardShortcuts({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
  const shortcutsDict = useTranslations("shortcuts");

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalOverlay>
        <ModalContent
          className="h-fit max-h-full w-full max-w-xl overflow-scroll scrollbar-none p-0"
        >
          <ModalHeader className="mt-6 mx-6">
            <ModalTitle className="text-lg m-auto">
              {shortcutsDict("title")}
            </ModalTitle>
          </ModalHeader>
          <div className="max-w-4xl mx-auto p-6 bg-background">
            {/* Form Operations Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2 pb-2">
                {shortcutsDict("todo.title")}
              </h2>
              <div className="overflow-hidden rounded-lg shadow-md">
                <table className="w-full bg-card text-sm">
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          Ctrl+Enter
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("todo.submitAndOpen")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          Q
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("todo.openForm")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          Esc
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("todo.exitForm")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          Double Click
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("todo.editForm")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Calendar Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2  pb-2">
                {shortcutsDict("calendar.title")}
              </h2>
              <div className="overflow-hidden rounded-lg shadow-md">
                <table className="w-full bg-card text-sm">
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          ←
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("calendar.previous")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          →
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("calendar.next")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          T
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("calendar.todayView")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          1
                        </kbd>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          2
                        </kbd>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          3
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("calendar.viewModes")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Navigation Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2  pb-2">
                {shortcutsDict("navigation.title")}
              </h2>
              <div className="overflow-hidden rounded-lg shadow-md">
                <table className="w-full bg-card text-sm">
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          G
                        </kbd>
                        <span className="mx-2 text-muted-foreground">
                          {shortcutsDict("navigation.then")}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          T
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("navigation.today")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          G
                        </kbd>
                        <span className="mx-2 text-muted-foreground">
                          {shortcutsDict("navigation.then")}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          C
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("navigation.calendar")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          G
                        </kbd>
                        <span className="mx-2 text-muted-foreground">
                          {shortcutsDict("navigation.then")}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          D
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("navigation.completed")}
                      </td>
                    </tr>
                    <tr className="hover:bg-accent transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          G
                        </kbd>
                        <span className="mx-2 text-muted-foreground">
                          {shortcutsDict("navigation.then")}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-xs">
                          V
                        </kbd>
                      </td>
                      <td className="px-6 py-3 text-card-foreground">
                        {shortcutsDict("navigation.vault")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}