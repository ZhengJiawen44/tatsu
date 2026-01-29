import React from "react";

const VaultLoading = () => {
  const fileList = [1, 2, 3, 4];
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
          {fileList.map((_index) => {
            return (
              <tr key={_index} className="border-b text-card-foreground">
                <td className="px-4 py-4">
                  <div className="w-full h-[90%] text-[1.1rem] bg-border text-border rounded-sm animate-pulse">
                    .
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="w-full h-[90%] text-[1.1rem] bg-border text-border rounded-sm animate-pulse">
                    .
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="w-full h-[90%] text-[1.1rem] bg-border text-border rounded-sm animate-pulse">
                    .
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VaultLoading;
