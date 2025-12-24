import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

type weekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
type byweekdayType = Set<weekday>;

const CustomRepeatModalMenu = ({ className }: { className?: string }) => {
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatFreqType, setRepeatFreqType] = useState("Day");
  const [byweekday, setByweekday] = useState<byweekdayType>(new Set());
  const [repeatEnd, setRepeatEnd] = useState<Date | null | undefined>(null);
  const [open, setOpen] = useState(false);

  const toggleWeekday = (day: weekday, checked: boolean) => {
    setByweekday((old) => {
      const newSet = new Set(old || []);
      if (checked) {
        newSet.add(day);
      } else {
        newSet.delete(day);
      }
      return newSet;
    });
  };
  return (
    <Dialog>
      <DialogTrigger className={className}>Custom</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">Custom Repeat</DialogTitle>
          <DialogDescription>Set up a custom repeat schedule</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Every</p>
            <div className="flex gap-2 w-1/2 m-0 p-0">
              {/* repeatInterval count input */}
              <Input
                className="w-1/2 border-border"
                type="number"
                min={1}
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(parseInt(e.target.value))}
              />
              {/* repeatInterval type input */}
              <NativeSelect className="min-w-1/2 h-full border-border hover:bg-accent">
                <NativeSelectOption
                  value={"Day"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Days" : "Day"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Week"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Weeks" : "Week"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Month"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Months" : "Month"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Year"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Years" : "Year"}
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium ">On</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Mo"
                  value={"MO"}
                  checked={byweekday.has("MO")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("MO", checked as boolean)
                  }
                />
                <label htmlFor="Mo">Mo</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Tu"
                  value={"TU"}
                  checked={byweekday.has("TU")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("TU", checked as boolean)
                  }
                />
                <label htmlFor="Tu">Tu</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="We"
                  value={"WE"}
                  checked={byweekday.has("WE")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("WE", checked as boolean)
                  }
                />
                <label htmlFor="We">We</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Th"
                  value={"TH"}
                  checked={byweekday.has("TH")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("TH", checked as boolean)
                  }
                />
                <label htmlFor="Th">Th</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Fr"
                  value={"FR"}
                  checked={byweekday.has("FR")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("FR", checked as boolean)
                  }
                />
                <label htmlFor="Fr">Fr</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Sa"
                  value={"SA"}
                  checked={byweekday.has("SA")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("SA", checked as boolean)
                  }
                />
                <label htmlFor="Sa">Sa</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="Su"
                  value={"SU"}
                  checked={byweekday.has("SU")}
                  onCheckedChange={(checked) =>
                    toggleWeekday("SU", checked as boolean)
                  }
                />
                <label htmlFor="Su">Su</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium ">ends</p>
            <RadioGroup>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="never"
                  id="never"
                  checked={repeatEnd ? false : true}
                  onClick={() => setRepeatEnd(null)}
                />
                <label htmlFor="never">never</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="exDate"
                  id="exDate"
                  checked={repeatEnd ? true : false}
                  onClick={() => setRepeatEnd(new Date())}
                />
                <label htmlFor="exDate">on Date (inclusive)</label>
                {/* date picker */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      id="date"
                      className={clsx(
                        "w-48 justify-between font-normal border-border opacity-0",
                        repeatEnd && "opacity-100",
                      )}
                    >
                      {repeatEnd
                        ? repeatEnd.toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={repeatEnd || new Date()}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setRepeatEnd(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRepeatModalMenu;
