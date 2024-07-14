import type { FC } from 'react';

export const Check: FC = () => (
  <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m.5 5.5 3 3 8.028-8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(5 6)"
    />
  </svg>
);

export const Cross: FC = () => (
  <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
    <g
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(5 5)"
    >
      <path d="m10.5 10.5-10-10z" />
      <path d="m10.5.5-10 10" />
    </g>
  </svg>
);
