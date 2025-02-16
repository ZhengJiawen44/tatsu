import React from "react";
import EyeClosed from "@/public/EyeClosed";
import Eye from "@/public/Eye";
import clsx from "clsx";
const EyeToggle = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <button
        type="button"
        aria-label="show-password"
        className={clsx(
          "absolute right-[16px] top-1/2 -translate-y-1/2  stroke-form-label hover:stroke-form-label-accent hover:cursor-pointer",
          !show && "hidden"
        )}
        onClick={() => {
          setShow(!show);
        }}
      >
        <Eye className="stroke-form-label hover:stroke-form-label-accent transition-all duration-300" />
      </button>
      <button
        aria-label="hide-password"
        type="button"
        className={clsx(
          "absolute right-[16px] top-1/2 -translate-y-1/2  stroke-form-label hover:stroke-form-label-accent hover:cursor-pointer",
          show && "hidden"
        )}
        onClick={() => {
          setShow(!show);
        }}
      >
        <EyeClosed className="stroke-form-label hover:stroke-form-label-accent transition-all duration-300" />
      </button>
    </>
  );
};

export default EyeToggle;
