import Condo from '@/controllers/Condo';
import Link from 'next/link';
import type { FC } from 'react';

const CondoList: FC = async () => {
  const list = await Condo.getList();

  return (
    <ul>
      {list.map((condo) => (
        <li key={condo.id.toString()}>
          <Link href={`/app/admin/condo/${condo.id}`}>{condo.getValue('name')}</Link>
        </li>
      ))}
    </ul>
  );
};

export default CondoList;
