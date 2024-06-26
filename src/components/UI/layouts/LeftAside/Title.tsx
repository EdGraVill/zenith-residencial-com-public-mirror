'use client';

import type { FC, PropsWithChildren } from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { TitleContext } from './TitleContainer';

export interface TitleProps extends PropsWithChildren {
  children: string;
}

const Title: FC<TitleProps> = ({ children }) => {
  const { titleId } = useContext(TitleContext);
  const title = useMemo(() => globalThis.document?.getElementById(titleId), [titleId]);

  useEffect(() => {
    if (title) {
      title.textContent = children;
    }
  }, [children, title]);

  return null;
};

export default Title;
