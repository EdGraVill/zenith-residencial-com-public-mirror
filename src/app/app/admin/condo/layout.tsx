import Persona from '@/controllers/Persona';
import adminCondoAccess from './access';

export default async function AdminCondoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const persona = await Persona.getWithCurrentSessionOrSignIn('/app/admin/condo');

  persona.hasAccessOrRedirect(adminCondoAccess);

  return children;
}
