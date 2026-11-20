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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import DateRangeDropdown from "./DateRangeDropdown";
import { useToast } from "@/hooks/use-toast";
import { SetStateAction, useState } from "react";
import { Page } from "@/types";
import { useUpdatePage } from "../query/update-page";
import { useDeletePage } from "../query/delete-page";
import EmojiPicker from "./EmojiPicker";

export const PageList = () => {
  const { deleteMutateFn } = useDeletePage();
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
              href={`/app/page/${page.id}`}
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
                        setOpenEditModal(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        deleteMutateFn({ id: page.id });
                      }}
                    >
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

  const { toast } = useToast();
  if (!editingPage) return <></>;
  return (
    <Modal open={openEditModal} onOpenChange={setOpenEditModal}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit view</ModalTitle>
            <span className="text-muted-foreground text-sm">
              Create new views where you can look at your todos from specific
              time intervals
            </span>
          </ModalHeader>
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
              <div className="flex bg-transparent text-foreground border w-full rounded-md">
                <EmojiPicker
                  className="border-r"
                  onSelect={(emoji) => {
                    setTitle(emoji + title);
                  }}
                />
                <input
                  onChange={(e) => {
                    setTitle(e.currentTarget.value);
                  }}
                  value={title}
                  name="viewTitle"
                  required
                  className="border-none w-full"
                />
              </div>
            </div>

            <div className="mb-2 text-muted-foreground">
              <span>Range*</span>
              <DateRangeDropdown
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
            <ModalFooter>
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => {
                  setOpenEditModal(false);
                }}
              >
                Cancel
              </Button>
              <Button variant={"outline"} type="submit">
                Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
