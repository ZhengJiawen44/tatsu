import React, { SetStateAction, useEffect } from "react";
import { FileItemType } from "@/types";
import { MeatballMenu, MenuItem } from "../ui/MeatballMenu";
import VaultLoading from "./VaultLoading";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface VaultContentProps {
  fileList: FileItemType[];
  loading: boolean;
  setPending: React.Dispatch<SetStateAction<boolean>>;
}

const VaultContent = ({ fileList, loading, setPending }: VaultContentProps) => {
  const downloadFile = async (url: string, fileName: string) => {
    try {
      // Fetch the file
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const queryClient = useQueryClient();

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

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/vault/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });

  useEffect(() => {
    setPending(deletePending);
  }, [deletePending]);

  if (loading) {
    return <VaultLoading />;
  }
  console.log(fileList);

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
                  <MeatballMenu>
                    <MenuItem onClick={() => downloadFile(url, name)}>
                      Download
                    </MenuItem>
                    {/* <MenuItem>Favourite</MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        deleteMutate(id);
                      }}
                    >
                      Delete
                    </MenuItem>
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
