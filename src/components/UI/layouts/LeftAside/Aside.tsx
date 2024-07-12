import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  isRtl?: boolean;
}

const Aside: FC<Props> = ({ children }) => {
  return <aside className="col-span-3 row-start-2 rounded-lg bg-white py-4 shadow-sm">{children}</aside>;
};

export default Aside;
