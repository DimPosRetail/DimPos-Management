import { memo } from "react";

const CreditCardIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" fill="currentColor" />
      <line x1="1" y1="10" x2="23" y2="10" stroke="white" strokeWidth="2" />
    </svg>
  );
};

export default memo(CreditCardIcon);
