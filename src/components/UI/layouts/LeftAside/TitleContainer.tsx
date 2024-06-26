'use client';

import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';

export const TitleContext = createContext({ titleId: '' });

interface Props extends PropsWithChildren {
  titleId: string;
}

const TitleContainer: FC<Props> = ({ children, titleId }) => (
  <TitleContext.Provider value={{ titleId }}>{children}</TitleContext.Provider>
);

export default TitleContainer;
