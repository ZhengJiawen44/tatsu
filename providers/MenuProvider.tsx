"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import path from "path";

type MenuState = {
  name: string;
  open?: boolean;
  children?: MenuState;
};

type MenuContextType = {
  activeMenu: MenuState;
  setActiveMenu: React.Dispatch<SetStateAction<MenuState>>;
  showMenu: boolean;
  setShowMenu: React.Dispatch<SetStateAction<boolean>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<SetStateAction<boolean>>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [activeMenu, setActiveMenu] = useState<MenuState>({ name: "Todo" });
  const [showMenu, setShowMenu] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  //infer last visited tab from pathname or retrieve from local storage
  useEffect(() => {
    if (pathName.includes("vault")) {
      setActiveMenu({ name: "Vault" });
      return;
    }
    if (pathName.includes("note")) {
      if (pathName.endsWith("note")) {
        setActiveMenu({ name: "Note", open: true });
        return;
      } else {
        const path = pathName.split("/");
        const noteID = path[path.length - 1];
        setActiveMenu({ name: "Note", open: true, children: { name: noteID } });
        return;
      }
    }
    if (pathName.includes("todo")) {
      setActiveMenu({ name: "Todo" });
      return;
    }
    if (pathName.includes("completed")) {
      setActiveMenu({ name: "Completed" });
      return;
    }

    let tab = localStorage.getItem("tab");
    if (tab) {
      const tabObj = JSON.parse(tab);
      setActiveMenu(tabObj);
    }
  }, []);

  //sync local menu state with local storage when menu state changes
  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify(activeMenu));
  }, [activeMenu]);

  // toggle menu on ctrl+b
  useEffect(() => {
    function closeOnKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "`") {
        setShowMenu((prev) => !prev);
      }
    }
    document.addEventListener("keydown", closeOnKey);
    return () => {
      document.removeEventListener("keydown", closeOnKey);
    };
  }, []);

  return (
    <MenuContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        showMenu,
        setShowMenu,
        isResizing,
        setIsResizing,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
