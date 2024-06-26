import type { PropsWithChildren } from 'react';

export type LayoutProps<P = Record<string, string>> = PropsWithChildren<{
  param: P;
}>;
