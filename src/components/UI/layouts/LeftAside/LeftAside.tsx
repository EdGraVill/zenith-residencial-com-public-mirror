import { useId, type FC, type PropsWithChildren } from 'react';
import Aside from './Aside';
import Section from './Section';
import { filterOnlyOneChildrenOfType, injectPropsToAllValidChildren } from '@/components/utils/children';
import Title from './Title';
import Heading from '../../typography/Heading';
import { headers } from 'next/headers';
import { capitalizeString } from '@/components/utils/string';

interface Props extends PropsWithChildren {
  isRtl?: boolean;
}

const LeftSaside: FC<Props> & { Aside: typeof Aside; Section: typeof Section; Title: typeof Title } = ({
  children,
  isRtl,
}) => {
  const titleId = useId();
  const allowedChildren = filterOnlyOneChildrenOfType(children, [
    [Aside, 'LeftAside.Aside'],
    [Section, 'LeftAside.Section'],
  ]);
  const childrenWithIsRtlProp = injectPropsToAllValidChildren<Props | { titleId: string }>(allowedChildren, {
    isRtl,
    titleId,
  });
  const provisionalTitle = capitalizeString(headers().get('x-next-pathname')?.split('/').pop() || '');

  return (
    <main className="container grid grid-cols-12 gap-x-8">
      <Heading as="h1" className="col-span-10 col-start-3" id={titleId}>
        {provisionalTitle}
      </Heading>
      {childrenWithIsRtlProp}
    </main>
  );
};
LeftSaside.Aside = Aside;
LeftSaside.Section = Section;
LeftSaside.Title = Title;

export default LeftSaside;
