import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from "@/components/ui/Modal";
import DateRangeDropdown from "./DateRangeDropdown";
import { startOfToday, startOfTomorrow } from "date-fns";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { useCreatePage } from "../query/create-page";
import SidebarItem from "../../SidebarItem";
import EmojiPicker from "./EmojiPicker";

const CreatePageButton = () => {
  const { createMutateFn } = useCreatePage();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfToday(),
    to: startOfTomorrow(),
  });
  const [openCreateModal, setOpenCreateModal] = useState(false);
  return (
    <>
      <SidebarItem onClick={() => setOpenCreateModal(true)}>
        <PlusIcon className={clsx("w-4.5 h-4.5 stroke-muted-foreground")} />
        <p> New View</p>
      </SidebarItem>
      <Modal open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create new view</ModalTitle>
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
                createMutateFn({
                  title,
                  from: dateRange.from,
                  to: dateRange.to,
                });
                setOpenCreateModal(false);
                setTitle("");
                setDateRange({
                  from: startOfToday(),
                  to: startOfTomorrow(),
                });
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
                    setOpenCreateModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant={"outline"} type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default CreatePageButton;
