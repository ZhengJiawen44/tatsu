import React from "react";
const Pin = ({ className }: { className?: string }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M10.7397 3.62823L8.88675 1.77347C7.62006 0.505564 6.98675 -0.128392 6.3065 0.0216767C5.62631 0.171752 5.31787 1.01347 4.70106 2.69691L4.28358 3.83631C4.11914 4.28511 4.03692 4.5095 3.88899 4.68308C3.82262 4.76096 3.7471 4.83055 3.66407 4.89032C3.47902 5.02356 3.24882 5.087 2.7884 5.21394C1.75067 5.5 1.2318 5.64306 1.03627 5.98256C0.951749 6.12931 0.907761 6.29594 0.90883 6.46538C0.911305 6.85719 1.29186 7.23813 2.05297 8L2.93709 8.88519L0.139655 11.6853C-0.0465516 11.8716 -0.0465516 12.1739 0.139655 12.3603C0.325861 12.5466 0.627767 12.5466 0.813974 12.3603L3.6115 9.56006L4.52775 10.4772C5.29369 11.2439 5.67669 11.6273 6.07087 11.6278C6.237 11.6281 6.40025 11.5849 6.54456 11.5026C6.887 11.3071 7.03081 10.7844 7.31844 9.73906C7.44494 9.2795 7.50812 9.04969 7.64087 8.86469C7.699 8.78375 7.76637 8.70988 7.84175 8.64463C8.01381 8.49563 8.23675 8.41188 8.68262 8.24438L9.83512 7.81131C11.5 7.18581 12.3324 6.87306 12.4792 6.19469C12.6259 5.51625 11.9971 4.88691 10.7397 3.62823Z"
        fill="#9799AA"
      />
    </svg>
  );
};

export default Pin;
