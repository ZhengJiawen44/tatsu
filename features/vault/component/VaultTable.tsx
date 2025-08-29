import React, { SetStateAction, useEffect } from "react";
import { FileItemType } from "@/types";
import {
  MenuContainer,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@/components/ui/Menu";
import Meatball from "@/components/ui/icon/meatball";
import VaultLoading from "./VaultLoading";
import { downloadFile } from "@/features/vault/lib/downloadFile";
import { useDeleteFile } from "../api/delete-file";
import { getDisplaySize } from "@/features/vault/lib/getDisplaySize";

interface VaultContentProps {
  fileList: FileItemType[];
  loading: boolean;
  setProcessing: React.Dispatch<SetStateAction<boolean>>;
}

const VaultContent = ({
  fileList,
  loading,
  setProcessing,
}: VaultContentProps) => {
  //delete file mutation function
  const { deleteMutate, deletePending } = useDeleteFile();

  useEffect(() => {
    setProcessing(deletePending);
  }, [deletePending, setProcessing]);

  if (loading) {
    return <VaultLoading />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="pr-4 xl:px-4 py-2">Name</th>
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
                <td className="pr-4 xl:px-4 py-2">
                  <a
                    href={url}
                    target="_blank"
                    className="text-blue-500"
                    title={name}
                  >
                    {name.length > 20
                      ? name.slice(0, 10) +
                        "..." +
                        name.slice(name.length - 6, name.length)
                      : name}
                  </a>
                </td>
                <td className="px-4 py-2 text-right">{displaySize}</td>
                <td className="px-4 py-2">
                  {new Date(createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <MenuContainer>
                    <MenuTrigger>
                      <Meatball />
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem onClick={() => downloadFile(url, name)}>
                        Download
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          deleteMutate({ id });
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuContent>
                  </MenuContainer>
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
