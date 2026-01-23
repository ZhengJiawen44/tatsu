import { SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-2/3  overflow-scroll scrollbar-none p-0"
        showCloseButton={false}
      >
        <DialogHeader className="mt-6 mx-6">
          <DialogTitle className="text-lg m-auto">
            {shortcutsDict("title")}
          </DialogTitle>
        </DialogHeader>
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
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Ctrl+Enter
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("todo.submitAndOpen")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Q
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("todo.openForm")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Esc
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("todo.exitForm")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
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
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        ←
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("calendar.previous")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        →
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("calendar.next")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        T
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("calendar.todayView")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        1
                      </kbd>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        2
                      </kbd>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
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
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">
                        {shortcutsDict("navigation.then")}
                      </span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        T
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("navigation.today")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">
                        {shortcutsDict("navigation.then")}
                      </span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        C
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("navigation.calendar")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">
                        {shortcutsDict("navigation.then")}
                      </span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        D
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      {shortcutsDict("navigation.completed")}
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">
                        {shortcutsDict("navigation.then")}
                      </span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
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
      </DialogContent>
    </Dialog>
  );
}