"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [activeMenu, setActiveMenu] = useState({ name: "Todo" });
  const [showMenu, setShowMenu] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  //retrieve user's last visited tab
  useEffect(() => {
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
