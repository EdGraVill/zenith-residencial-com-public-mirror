import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { type FC } from 'react';
import type { z } from 'zod';

import Actions from './Actions';
import BadgeStatus from './BadgeStatus';
import { TableCell, TableRow } from '@/components/ui/table';
import type { listsSchema, requestSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
  request: z.infer<typeof requestSchema>;
}

const RequestRow: FC<Props> = (props) => {
  const { currentUserId, request } = props;

  return (
    <TableRow
      className={cn({
        'bg-blue-50': currentUserId === request.house,
        'opacity-50': request.requestStatus !== 'pending',
      })}
      key={request.uuid}
    >
      <TableCell className="w-[105px]">
        <div className="flex flex-col items-center justify-center">
          {request.requestStatus === 'pending' && (
            <span className="text-xs font-light text-nowrap">{request.street}</span>
          )}
          <span
            className={cn('font-bold', {
              'text-xs': request.requestStatus !== 'pending',
            })}
          >
            {request.house}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[180px]">
        <div className="flex flex-col items-center justify-center gap-y-1">
          <BadgeStatus
            className={cn({
              'text-[10px]': request.requestStatus !== 'pending',
            })}
            status={request.requestStatus}
          />
          {request.requestStatus === 'pending' && (
            <span className="text-[10px] font-light text-balance text-center">
              Desde hace {formatDistanceToNow(request.createdAt, { locale: es })}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[120px]">
        <Actions {...props} />
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;
