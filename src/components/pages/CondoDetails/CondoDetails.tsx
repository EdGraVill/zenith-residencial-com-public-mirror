import EditableText from '@/components/UI/inputs/EditableText';
import LeftAside from '@/components/UI/layouts/LeftAside';
import Condo from '@/controllers/Condo';
import { Types } from 'mongoose';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import { editCondoProperty } from './actions';

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
      <p>Condo ID: {params.condoId}</p>
      <p>
        Email:{' '}
        <EditableText initialValue={condo.getValue('email')} intent={editCondoProperty.bind(null, condo.id, 'email')} />{' '}
      </p>
      <pre>Condo: {JSON.stringify(condo.toJSON(), undefined, 2)}</pre>
    </LeftAside.Section>
  );
};

export default CondoDetails;
