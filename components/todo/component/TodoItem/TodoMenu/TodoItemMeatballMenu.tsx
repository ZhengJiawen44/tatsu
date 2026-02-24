import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Meatball from "@/components/ui/icon/meatball";
import dynamic from "next/dynamic";
import { useState } from "react";
import { TodoItemType } from "@/types";
import DropdownMenuLoading from "../../Loading/DropdownMenuLoading";

const MenuContent = dynamic(() => import("./TodoItemMeatballMenuContent"), {
  ssr: false,
  loading: () => <DropdownMenuLoading />
});

type TodoItemMeatballMenuProps = {
  todo: TodoItemType,
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>,
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function TodoItemMeatballMenu({ ...props }: TodoItemMeatballMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}
          size={"icon"}
          className="border-none text-muted-foreground"
        >
          <Meatball className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-1.5 px-0 [&_svg:not([class*='size-'])]:size-5 lg:min-w-60 border border-popover-border shadow-2xl">
        {open && <MenuContent {...props} />}
      </DropdownMenuContent>
    </DropdownMenu >
  );
}
