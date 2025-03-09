import Pin from "@/components/ui/icon/pin";
import Edit from "@/components/ui/icon/edit";
import Trash from "@/components/ui/icon/trash";
import React from "react";

const TodoItemSideMenu = () => {
  return (
    <>
      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Pin className="w-[17px] h-[17px]" />
      </div>

      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Edit className="w-[17px] h-[17px]" />
      </div>
      <div className="hover:bg-border text-card-foreground-muted hover:text-white p-1 rounded-md">
        <Trash className="w-[17px] h-[17px]" />
      </div>
    </>
  );
};

export default TodoItemSideMenu;
