import cn from 'classnames';
import type { DetailedHTMLProps, FC, HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';
import Caption from './Caption';

interface Props extends DetailedHTMLProps<HTMLProps<HTMLHeadingElement>, HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  caption?: string;
}

const Heading: FC<Props> = ({ as: Component, caption, className, ...props }) => (
  <Component
    className={twMerge(
      cn('w-full', {
        'py-1 font-bold': Component === 'h3',
        'py-2 text-2xl font-bold': Component === 'h1',
        'py-2 text-xl font-bold': Component === 'h2',
      }),
      className,
    )}
    {...props}
  >
    {props.children}
    {caption && <Caption>{caption}</Caption>}
  </Component>
);

export default Heading;
