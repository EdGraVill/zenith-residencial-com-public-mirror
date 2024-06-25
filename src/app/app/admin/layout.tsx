import Navbar from '@/components/sections/Navbar';
import Persona from '@/controllers/Persona';
import assert from '@/utils/assert';
import adminAccess from './access';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const persona = await Persona.getWithCurrentSessionOrSignIn('/app/admin');

  assert(persona);

  persona.hasAccessOrRedirect(adminAccess);

  return (
    <>
      <Navbar accessType={persona.getValue('accessType')} />
      {children}
    </>
  );
}
