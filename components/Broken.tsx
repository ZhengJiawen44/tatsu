"use client";
import React, { useState } from "react";

const BrokenComponent = () => {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("This is an intentional error!");
  }

  return (
    <div className="bg-card m-auto w-fit mt-12 p-4 rounded-xl">
      <button onClick={() => setThrowError(true)}>Trigger Error</button>
    </div>
  );
};

export default BrokenComponent;
