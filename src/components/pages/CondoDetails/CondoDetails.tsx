import LeftAside from '@/components/UI/layouts/LeftAside';
import Condo from '@/controllers/Condo';
import { Types } from 'mongoose';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import { editCondoProperty } from './actions';
import EditableText from '@/components/UI/inputs/EditableText';
import Heading from '@/components/UI/typography/Heading';
import Article from '@/components/UI/layouts/Article';

interface Props {
  params: {
    condoId: string;
  };
}

const CondoDetails: FC<Props> = async ({ params }) => {
  if (!params.condoId) {
    return redirect('/app/admin/condo');
  }

  let condo: Condo;

  try {
    condo = await Condo.getById(new Types.ObjectId(params.condoId));
  } catch (error) {
    return redirect('/app/admin/condo');
  }

  return (
    <LeftAside.Section title={condo.getValue('name')}>
      <Article>
        <Heading as="h2" caption="Datos de una persona en concreto">
          Datos de contacto
        </Heading>
        <div className="space-y-2">
          <div>
            <Heading as="h3">Nombre completo</Heading>
            <EditableText onUpdate={editCondoProperty.bind(null, condo.id, 'contact.name')}>
              {condo.getValue('contact').name}
            </EditableText>
          </div>
          <div>
            <Heading as="h3">Teléfono a 10 dígitos</Heading>
            <EditableText onUpdate={editCondoProperty.bind(null, condo.id, 'contact.phone')}>
              {condo.getValue('contact').phone}
            </EditableText>
          </div>
          <div>
            <Heading as="h3">Correo Electrónico</Heading>
            <EditableText onUpdate={editCondoProperty.bind(null, condo.id, 'contact')}>
              {condo.getValue('contact').email}
            </EditableText>
          </div>
        </div>
      </Article>
      <pre>Condo: {JSON.stringify(condo.toJSON(), undefined, 2)}</pre>
    </LeftAside.Section>
  );
};

export default CondoDetails;
