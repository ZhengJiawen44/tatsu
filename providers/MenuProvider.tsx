"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type MenuContextType = {
  showMobileSideBar: boolean;
  setShowMobileSidebar: React.Dispatch<SetStateAction<boolean>>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<SetStateAction<string>>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [showMobileSideBar, setShowMobileSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Todo");
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
        showMobileSideBar,
        setShowMobileSidebar,
        activeMenu,
        setActiveMenu,
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
