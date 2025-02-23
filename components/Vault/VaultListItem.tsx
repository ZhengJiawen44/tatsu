import React from "react";
import LineSeparator from "../ui/lineSeparator";
import { MeatballMenu, MenuItem } from "../ui/MeatballMenu";
const VaultContent = () => {
  const files = [
    "animateTree.gif",
    "HA200053_JPG_jpg.rf.1016b388dae5f8541d65617a378f1fc4.jpg",
    "label_Lymphoblast_sample.pdf",
  ];
  return (
    <div>
      {files.map((file) => {
        return (
          <div className="my-5" key={file}>
            <div className="flex justify-between text-card-foreground">
              <button className="hover:text-white">{file}</button>
              <MeatballMenu>
                <MenuItem>download</MenuItem>
                <MenuItem>favourite</MenuItem>
                <MenuItem>delete</MenuItem>
              </MeatballMenu>
            </div>
            <LineSeparator />
          </div>
        );
      })}
    </div>
  );
};

export default VaultContent;
