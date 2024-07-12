import type { FC, PropsWithChildren } from 'react';
import Aside from './Aside';
import Section from './Section';
import { injectPropsToAllValidChildren } from '@/components/utils/children';

interface Props extends PropsWithChildren {
  isRtl?: boolean;
}

const LeftSaside: FC<Props> & { Aside: typeof Aside; Section: typeof Section } = ({ children, isRtl }) => {
  const childrenWithIsRtlProp = injectPropsToAllValidChildren<Props | { titleId: string }>(children, {
    isRtl,
  });

  return <main className="container grid grid-cols-12 gap-x-4">{childrenWithIsRtlProp}</main>;
};
LeftSaside.Aside = Aside;
LeftSaside.Section = Section;

export default LeftSaside;
