import Persona from '@/controllers/Persona';
import adminAccess from './access';
import type { FC } from 'react';
import type { LayoutProps } from '../layoutTypes';
import LeftAside from '@/components/UI/layouts/LeftAside';
import VerticalNavbar from './VerticalNavbar';

const AdminLayout: FC<LayoutProps> = async ({ children }) => {
  const persona = await Persona.getWithCurrentSessionOrSignIn('/app/admin');

  persona.hasAccessOrRedirect(adminAccess);

  return (
    <LeftAside>
      <LeftAside.Aside>
        <VerticalNavbar accessType={persona.getValue('accessType')} />
      </LeftAside.Aside>
      <LeftAside.Section>{children}</LeftAside.Section>
    </LeftAside>
  );
};

export default AdminLayout;
