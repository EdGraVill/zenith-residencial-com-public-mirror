import cn from 'classnames';
import type { DetailedHTMLProps, FC, HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends DetailedHTMLProps<HTMLProps<HTMLHeadingElement>, HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: FC<Props> = ({ as: Component, className, ...props }) => {
  return (
    <Component
      className={twMerge(
        cn('', {
          'py-2 text-2xl font-bold': Component === 'h1',
        }),
        className,
      )}
      {...props}
    />
  );
};

export default Heading;
