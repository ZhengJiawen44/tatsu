import React from "react";
import BottomPanel from "./BottomPanel/BottomPanelContainer";
import TopPanel from "./TopPanel/Clock";
const index = ({ activeMenu }: { activeMenu: string }) => {
  return (
    <>
      <TopPanel />
      <BottomPanel activeMenu={activeMenu} />
    </>
  );
};

export default index;
