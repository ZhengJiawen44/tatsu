"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import useWindowSize from "@/hooks/useWindowSize";

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
  const { width } = useWindowSize();
  const pathName = usePathname();
  const [activeMenu, setActiveMenu] = useState<MenuState>({ name: "Todo" });
  const [showMenu, setShowMenu] = useState(false); // Always start with false for SSR
  const [isResizing, setIsResizing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state and initialize showMenu based on width
  useEffect(() => {
    setMounted(true);
    setShowMenu(width >= 1300);
  }, [width]);

  // Infer last visited tab from pathname or retrieve from local storage
  useEffect(() => {
    if (!mounted) return;

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
    const tab = localStorage.getItem("tab");
    if (tab) {
      const tabObj = JSON.parse(tab);
      setActiveMenu(tabObj);
    }
  }, [mounted, pathName]);

  // Sync local menu state with local storage when menu state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("tab", JSON.stringify(activeMenu));
    }
  }, [activeMenu, mounted]);

  // Toggle menu on ctrl+`
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