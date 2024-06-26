import adminCondoAccess from '@/components/layouts/AdminCondoLayout/access';
import type { AccessTypeEnum } from '@/db/Persona.model';
import { isOneOf } from '@/utils/is';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  accessType: AccessTypeEnum;
}

const VerticalNavbar: FC<Props> = ({ accessType }) => {
  const showCondoSettings = isOneOf(accessType, adminCondoAccess);

  return (
    <nav className="flex w-full flex-col items-stretch">
      {showCondoSettings && (
        <Link
          className="border-l-8 border-black py-1 pl-4 font-semibold transition-all hover:border-l-4 hover:pl-6"
          href="/app/admin/condo"
        >
          Condominios
        </Link>
      )}
    </nav>
  );
};

export default VerticalNavbar;
