import LeftAside from '@/components/UI/layouts/LeftAside';
import Condo from '@/controllers/Condo';
import Link from 'next/link';
import type { FC } from 'react';

const CondoList: FC = async () => {
  const list = await Condo.getList();

  return (
    <LeftAside.Section title="Condominios">
      <ul className="flex w-full flex-col items-stretch">
        {list.map((condo) => (
          <li className="block w-full" key={condo.id.toString()}>
            <Link
              className="block w-full px-6 py-3 transition-colors hover:bg-slate-50"
              href={`/app/admin/condo/${condo.id}`}
            >
              {condo.getValue('name')}
            </Link>
          </li>
        ))}
      </ul>
    </LeftAside.Section>
  );
};

export default CondoList;
