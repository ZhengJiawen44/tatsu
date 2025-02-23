import React from "react";

const VaultMenuItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      disabled={true}
      title="coming soon"
      className="flex justify-center items-center gap-2 bg-border rounded-lg p-1 px-3 hover:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default VaultMenuItem;
