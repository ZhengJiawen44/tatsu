import CaretOutline from "@/components/ui/icon/caretOutline";
import LineSeparator from "@/components/ui/lineSeparator";
import { TodoItemType } from "@/types";
import clsx from "clsx";
import React, { SetStateAction, useState } from "react";
import GroupedTodo from "./GroupedTodo";

interface PreviousTodoProps {
  openDetails: Record<string, boolean>;
  setOpenDetails: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  groupedUnpinnedTodos: Record<string, TodoItemType[]>;
}

const PreviousTodo = ({
  openDetails,
  setOpenDetails,
  groupedUnpinnedTodos,
}: PreviousTodoProps) => {
  const [openPrevious, setOpenPrevious] = useState(false);

  return (
    <details
      open={openPrevious}
      onClick={(e) => {
        e.preventDefault();
        setOpenPrevious(!openPrevious);
      }}
    >
      <summary className="relative flex items-center gap-2 text-lg font-medium hover:cursor-pointer">
        <div className="flex items-center gap-2 w-full">
          <CaretOutline
            className={clsx(
              "w-6 h-6 absolute -left-7 hover:bg-border rounded-md p-1 transition-all duration-200",
              openPrevious === true && "rotate-90"
            )}
          />
          <p>previous</p>
          <LineSeparator className="flex-1" />
        </div>
      </summary>
      <div className="flex flex-col gap-4 mt-4">
        {Object.entries(groupedUnpinnedTodos).map(([date, todos]) => {
          if (date !== "today") {
            return (
              <div key={date}>
                <details
                  name={date}
                  className="p-1 ml-4"
                  open={openDetails[date] === true}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenDetails((prev) => {
                      return { ...prev, [date]: !prev[date] };
                    });
                  }}
                >
                  <summary className="relative flex items-center gap-2 text-lg font-medium">
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <CaretOutline
                        className={clsx(
                          "w-6 h-6 absolute -left-7 hover:bg-border rounded-md p-1 transition-all duration-200",
                          openDetails[date] === true && "rotate-90"
                        )}
                      />

                      <h3 className="text-lg font-semibold select-none">
                        {date}
                      </h3>
                    </div>
                    <LineSeparator className="flex-1" />
                  </summary>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <GroupedTodo todos={todos} />
                  </div>
                </details>
              </div>
            );
          }
        })}
      </div>
    </details>
  );
};

export default PreviousTodo;
