import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import MobileSideBarMenu from "@/components/ui/icon/sideBarMenu";
import MenuContent from "./MenuContent";
import { useMenu } from "@/providers/MenuProvider";

const MobileMenuContainer = ({}) => {
  const { showMobileSideBar, setShowMobileSidebar } = useMenu();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 100) {
      // Swipe left to close
      setShowMobileSidebar(false);
    }
  };
  // diable scrolling when mobile menu is out
  useEffect(() => {
    if (showMobileSideBar === true) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [showMobileSideBar]);
  return (
    <>
      {/* mobile sidebar */}
      <div className="xl:hidden">
        {/* Mobile menu trigger button */}
        <div
          className={clsx(
            "fixed z-20 bg-black inset-0 opacity-50",
            !showMobileSideBar && "hidden"
          )}
          onClick={() => setShowMobileSidebar(false)}
        ></div>
        <button
          className={clsx(
            "fixed top-4 left-4 z-40",
            showMobileSideBar && "hidden"
          )}
          onClick={() => setShowMobileSidebar(!showMobileSideBar)}
        >
          <MobileSideBarMenu className="hover:stroke-white hover:cursor-pointer h-8 w-8" />
        </button>

        {/* Mobile menu container */}
        <div
          id="mobile_menu_container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={clsx(
            "fixed top-0 left-0 z-30 h-full w-[80%] bg-card transition-transform duration-300 transform p-5 pt-10",
            !showMobileSideBar && "-translate-x-full"
          )}
        >
          <MenuContent />
        </div>
      </div>
    </>
  );
};

export default MobileMenuContainer;
