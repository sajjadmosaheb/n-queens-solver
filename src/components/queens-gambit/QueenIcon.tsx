import type { SVGProps } from 'react';

export function QueenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      {...props}
      // Gold color #FFD700 will be applied via className or style prop
    >
      <path d="M12 2L8 8l2 2H6l2 6h8l2-6h-4l2-2z" />
      <path d="M18 20H6" />
      <path d="M12 14v6" />
      <circle cx="12" cy="4.5" r="0.5" fill="currentColor" />
      <circle cx="9.5" cy="9.5" r="0.5" fill="currentColor" />
      <circle cx="14.5" cy="9.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
