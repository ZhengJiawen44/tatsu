import LineSeparator from "@/components/ui/lineSeparator";
import { usePage } from "../query/get-page";
import SidebarItem from "../../SidebarItem";
import { useMenu } from "@/providers/MenuProvider";
import { Link } from "@/i18n/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import Meatball from "@/components/ui/icon/meatball";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import DateRangeDropdown from "./DateRangeDropdown";
import { useToast } from "@/hooks/use-toast";
import { SetStateAction, useState } from "react";
import { Page } from "@/types";
import { useUpdatePage } from "../query/update-page";

export const PageList = () => {
  const { pages } = usePage();
  const { width } = useWindowSize();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Omit<Page, "userId"> | null>(
    null,
  );
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();

  if (!pages.length) return <></>;

  return (
    <>
      <LineSeparator className="my-2" />
      {openEditModal === true && (
        <EditPageModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          editingPage={editingPage}
        />
      )}
      {pages.map((page) => {
        return (
          <SidebarItem
            asChild
            className={
              activeMenu.name === page.title + ":" + page.id
                ? "bg-sidebar-primary"
                : ""
            }
            key={page.id}
          >
            <Link
              className="group text-foreground relative cursor-pointer"
              href="/app/todo"
              onClick={() => {
                setActiveMenu({ name: page.title + ":" + page.id });
                if (width <= 766) setShowMenu(false);
              }}
            >
              {page.title}
              <div className="flex cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden group-hover:block data-[state=open]:block cursor-pointer">
                    <Meatball className="w-5 h-5 hover:text-foreground cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        setEditingPage(page);
                        // waits for dropdown to release body pointer-events, otherwise improper ending of dropdown renders whole body with pointer-events-none (leftover)
                        requestAnimationFrame(() => setOpenEditModal(true));
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          </SidebarItem>
        );
      })}
    </>
  );
};

const EditPageModal = ({
  openEditModal,
  setOpenEditModal,
  editingPage,
}: {
  openEditModal: boolean;
  setOpenEditModal: React.Dispatch<SetStateAction<boolean>>;
  editingPage: Omit<Page, "userId"> | null;
}) => {
  const { updateMutateFn } = useUpdatePage();
  const [title, setTitle] = useState(editingPage?.title);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: editingPage?.from,
    to: editingPage?.to,
  });
  console.log(title, dateRange);

  const { toast } = useToast();
  if (!editingPage) return <></>;
  return (
    <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new view</DialogTitle>
          <span className="text-muted-foreground text-sm">
            Create new views where you can look at your todos from specific time
            intervals
          </span>
        </DialogHeader>
        <form
          className="pb-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!dateRange.from || !dateRange.to) {
              toast({ description: "Date range must not be empty" });
              return;
            }

            if (!title) {
              toast({ description: "Title must not be empty" });
              return;
            }
            updateMutateFn({
              id: editingPage.id,
              title: editingPage.title === title ? undefined : title,
              from:
                dateRange.from.getTime() === editingPage.from.getTime()
                  ? undefined
                  : dateRange.from,
              to:
                dateRange.to.getTime() === editingPage.to.getTime()
                  ? undefined
                  : dateRange.to,
            });
            setOpenEditModal(false);
          }}
        >
          <div className="mb-2 text-muted-foreground">
            <span>Title*</span>
            <input
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
              defaultValue={title}
              name="viewTitle"
              required
              className="bg-transparent text-foreground outline-hidden border px-2 pr-9 w-full rounded-md"
            />
            <p>{title}</p>
          </div>

          <div className="mb-2 text-muted-foreground">
            <span>Range*</span>
            <DateRangeDropdown
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => {
                setOpenEditModal(!openEditModal);
              }}
            >
              Cancel
            </Button>
            <Button variant={"outline"} type="submit">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
