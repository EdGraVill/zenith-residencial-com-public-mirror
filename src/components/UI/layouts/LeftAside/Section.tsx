import type { FC, PropsWithChildren } from 'react';
import Heading from '@/components/UI/typography/Heading';

interface Props extends PropsWithChildren {
  isRtl?: boolean;
  title?: string;
}

const Section: FC<Props> = ({ children, title }) => {
  return (
    <>
      {title && (
        <Heading as="h1" className="col-span-9 col-start-4 py-4">
          {title}
        </Heading>
      )}
      <section className="col-span-9 row-start-2 rounded-lg bg-white py-4 shadow-sm">{children}</section>
    </>
  );
};

export default Section;
