import { SetStateAction } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

export default function KeyboardShortcuts({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-2/3  overflow-scroll scrollbar-none p-0">
        <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
          {/* Form Operations Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2 pb-2">
              Todo shortcuts
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
                      Submit form and open another
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Q
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Open form
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Esc
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Exit form
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        Double Click
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Edit form
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Calendar Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2  pb-2">
              Calendar shortcuts
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
                      Previous month/week/day
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        →
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Next month/week/day
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        T
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Today view
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
                      Month/Week/Day view
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Navigation Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b-2  pb-2">
              Navigation
            </h2>
            <div className="overflow-hidden rounded-lg shadow-md">
              <table className="w-full bg-card text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">then</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        T
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">Today</td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">then</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        C
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">Calendar</td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">then</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        D
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">
                      Completed
                    </td>
                  </tr>
                  <tr className="hover:bg-accent transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        G
                      </kbd>
                      <span className="mx-2 text-muted-foreground">then</span>
                      <kbd className="px-3 py-1.5 text-sm font-mono bg-muted border border-border rounded shadow-sm">
                        V
                      </kbd>
                    </td>
                    <td className="px-6 py-3 text-card-foreground">Vault</td>
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
