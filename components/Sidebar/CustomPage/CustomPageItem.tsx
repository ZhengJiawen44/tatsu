import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import DateRangeDropdown from "./DateRangeDropdown";
import { startOfToday, startOfTomorrow } from "date-fns";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

const CustomPageItem = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfToday(),
    to: startOfTomorrow(),
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          className={clsx("flex items-center font-normal px-2!")}
        >
          <div className="flex gap-3 justify-start items-center w-full  select-none">
            <PlusIcon className={clsx("w-4.5 h-4.5 stroke-muted-foreground")} />
            <p> New View</p>
          </div>
        </Button>
      </DialogTrigger>
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
          }}
        >
          <div className="mb-2 text-muted-foreground">
            <span>Title*</span>
            <input
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
              name="viewTitle"
              required
              className="bg-transparent text-foreground outline-hidden border px-2 pr-9 w-full rounded-md"
            />
          </div>

          <div className="mb-2 text-muted-foreground">
            <span>Range*</span>
            <DateRangeDropdown
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
          <DialogFooter>
            <Button variant={"destructive"}>Cancel</Button>
            <Button variant={"outline"} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPageItem;
