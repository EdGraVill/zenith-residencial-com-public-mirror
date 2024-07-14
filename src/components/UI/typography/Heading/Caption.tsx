import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Caption: FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({ className, ...props }) => (
  <caption className={twMerge('w-full text-nowrap text-sm font-thin text-gray-600', className)} {...props} />
);

export default Caption;
