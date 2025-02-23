import React from "react";
import { FileItemType } from "@/types";
import { MeatballMenu, MenuItem } from "../ui/MeatballMenu";
import VaultLoading from "./VaultLoading";
const VaultContent = ({
  fileList,
  loading,
}: {
  fileList: FileItemType[];
  loading: boolean;
}) => {
  function getDisplaySize(size: number) {
    if (size >= 1_073_741_824) {
      // GB
      return (size / 1_073_741_824).toFixed(1) + " GB";
    } else if (size >= 1_048_576) {
      // MB
      return (size / 1_048_576).toFixed(1) + " MB";
    } else if (size >= 1024) {
      // KB
      return (size / 1024).toFixed(1) + " KB";
    }
    return `${size} B`; // Bytes
  }

  if (loading) {
    return <VaultLoading />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {fileList.map(({ id, name, size, createdAt, url }) => {
            const displaySize = getDisplaySize(size);
            return (
              <tr key={id} className="border-b text-card-foreground">
                <td className="px-4 py-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {name}
                  </a>
                </td>
                <td className="px-4 py-2 text-right">{displaySize}</td>
                <td className="px-4 py-2">
                  {new Date(createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <MeatballMenu>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Favourite</MenuItem>
                    <MenuItem>Delete</MenuItem>
                  </MeatballMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VaultContent;
