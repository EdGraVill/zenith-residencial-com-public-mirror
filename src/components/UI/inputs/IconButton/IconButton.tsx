import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';

const IconButton: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
  className,
  ...props
}) => (
  <button
    className={twMerge(
      'aspect-square rounded-md border border-black stroke-2 p-1 transition-transform active:scale-75',
      className,
    )}
    {...props}
  />
);

export default IconButton;
