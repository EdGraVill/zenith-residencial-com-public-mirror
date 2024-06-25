import adminCondoAccess from '@/app/app/admin/condo/access';
import type { AccessTypeEnum } from '@/db/Persona.model';
import { isOneOf } from '@/utils/is';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  accessType: AccessTypeEnum;
}

const AdminNavbar: FC<Props> = ({ accessType }) => {
  const showCondoSettings = isOneOf(accessType, adminCondoAccess);

  return <nav>{showCondoSettings && <Link href="/app/admin/condo">Condominios</Link>}</nav>;
};

export default AdminNavbar;
