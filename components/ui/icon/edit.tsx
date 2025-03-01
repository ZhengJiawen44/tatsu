import React from "react";

const Edit = ({ className }: { className?: string }) => {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.4826 3.9815L4.26008 11.2041C3.6151 11.8551 1.68625 12.1532 1.21773 11.7212C0.749211 11.2892 1.08994 9.36039 1.73492 8.70933L8.95747 1.48679C9.29097 1.16918 9.73546 0.994521 10.1959 1.00013C10.6564 1.00575 11.0965 1.19118 11.4221 1.51684C11.7478 1.84248 11.9333 2.28255 11.9388 2.74306C11.9445 3.20357 11.7698 3.64801 11.4522 3.9815H11.4826Z"
        stroke="#ffffff"
        strokeWidth="1.46033"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4762 12H7"
        stroke="#ffffff"
        strokeWidth="1.46033"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Edit;
