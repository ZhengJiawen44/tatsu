import React from "react";

const Trash = ({ className }: { className?: string }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      stroke="currentColor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path d="M11.6251 2.875H1" stroke="currentColor" strokeLinecap="round" />
      <path
        d="M10.5833 4.4375L10.2958 8.74944C10.1851 10.4088 10.1298 11.2384 9.58919 11.7442C9.04857 12.25 8.21707 12.25 6.55407 12.25H6.07075C4.40772 12.25 3.57622 12.25 3.03559 11.7442C2.49496 11.2384 2.43965 10.4088 2.32903 8.74944L2.04156 4.4375"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M4.75 6L5.0625 9.125"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M7.875 6L7.5625 9.125"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M2.875 2.875C2.90992 2.875 2.92739 2.875 2.94322 2.8746C3.45787 2.86156 3.91189 2.53432 4.08701 2.0502C4.0924 2.03531 4.09792 2.01874 4.10896 1.98561L4.16964 1.80357C4.22144 1.64817 4.24734 1.57047 4.28169 1.5045C4.41876 1.24129 4.67234 1.05852 4.96538 1.01173C5.03883 1 5.12075 1 5.28456 1H7.34044C7.50425 1 7.58619 1 7.65963 1.01173C7.95269 1.05852 8.20625 1.24129 8.34331 1.5045C8.37769 1.57047 8.40356 1.64817 8.45538 1.80357L8.51606 1.98561C8.52706 2.0187 8.53262 2.03532 8.538 2.0502C8.71312 2.53432 9.16712 2.86156 9.68181 2.8746C9.69762 2.875 9.71506 2.875 9.75 2.875"
        stroke="currentColor"
      />
    </svg>
  );
};

export default Trash;
