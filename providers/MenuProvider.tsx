"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type MenuContextType = {
  activeMenu: string;
  setActiveMenu: React.Dispatch<SetStateAction<string>>;
  showMenu: boolean;
  setShowMenu: React.Dispatch<SetStateAction<boolean>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<SetStateAction<boolean>>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState("Todo");
  const [showMenu, setShowMenu] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  //retrieve user's last visited tab
  useEffect(() => {
    const prevTab = localStorage.getItem("prevTab");
    if (prevTab && ["Note", "Todo", "Vault"].includes(prevTab)) {
      setActiveMenu(prevTab);
    }
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
