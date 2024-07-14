import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Article: FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({ className, ...props }) => (
  <article className={twMerge('my-4 px-4', className)} {...props} />
);

export default Article;
