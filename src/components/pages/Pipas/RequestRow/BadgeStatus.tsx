import type { ComponentProps, FC } from 'react';

import { Badge } from '@/components/ui/badge';
import type { privateWaterTankerRequestStatusEnum } from '@/db/privateSchema';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<typeof Badge> {
  status: (typeof privateWaterTankerRequestStatusEnum.enumValues)[number];
}

const mapStatusToClassname: Record<(typeof privateWaterTankerRequestStatusEnum.enumValues)[number], string> = {
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-gray-100 text-gray-800',
};

const mapStatusToText: Record<(typeof privateWaterTankerRequestStatusEnum.enumValues)[number], string> = {
  cancelled: 'Cancelado',
  completed: 'Completado',
  pending: 'Pendiente',
};

const BadgeStatus: FC<Props> = ({ status, className, ...props }) => (
  <Badge className={cn(mapStatusToClassname[status], className)} {...props}>
    {mapStatusToText[status]}
  </Badge>
);

export default BadgeStatus;
