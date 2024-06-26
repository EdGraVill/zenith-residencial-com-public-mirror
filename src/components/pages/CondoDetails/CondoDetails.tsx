import LeftAside from '@/components/UI/layouts/LeftAside';
import Condo from '@/controllers/Condo';
import { Types } from 'mongoose';
import { redirect } from 'next/navigation';
import type { FC } from 'react';

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
    <div>
      <LeftAside.Title>{condo.getValue('name')}</LeftAside.Title>
      <p>Condo ID: {params.condoId}</p>
      <pre>Condo: {JSON.stringify(condo.toJSON(), undefined, 2)}</pre>
    </div>
  );
};

export default CondoDetails;
