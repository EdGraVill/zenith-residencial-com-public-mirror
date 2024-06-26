import Persona from '@/controllers/Persona';
import adminCondoAccess from './access';
import type { FC } from 'react';
import type { LayoutProps } from '../layoutTypes';

const AdminCondoLayout: FC<LayoutProps> = async ({ children }) => {
  const persona = await Persona.getWithCurrentSessionOrSignIn('/app/admin/condo');

  persona.hasAccessOrRedirect(adminCondoAccess);

  return <>{children}</>;
};

export default AdminCondoLayout;
