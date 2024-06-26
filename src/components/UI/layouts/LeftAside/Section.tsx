import type { FC, PropsWithChildren } from 'react';
import TitleContainer from './TitleContainer';

interface Props extends PropsWithChildren {
  isRtl?: boolean;
  titleId?: string;
}

const Section: FC<Props> = ({ children, titleId = '' }) => {
  return (
    <section className="col-span-10 row-start-2 rounded-lg bg-white py-4 shadow-sm">
      <TitleContainer titleId={titleId}>{children}</TitleContainer>
    </section>
  );
};

export default Section;
