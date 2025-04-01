import { type FC } from 'react';
import type { z } from 'zod';

import ActionsButton from './ActionsButton';
import BadgeStatus from './BadgeStatus';
import RelativeTimeToNow from '@/components/common/RelativeTimeToNow';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import type { requestSchema, waterTankersSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  isFiltered: boolean;
  request: z.infer<typeof requestSchema>;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const RequestRow: FC<Props> = (props) => {
  const { currentUserId, request } = props;

  return (
    <TableRow
      className={cn({
        'bg-blue-50': currentUserId === request.house,
        'opacity-50': request.status !== 'pending',
      })}
      key={request.uuid}
    >
      <TableCell className="w-[105px]">
        <div className="flex flex-col items-center justify-center">
          {request.status === 'pending' && <span className="text-xs font-light text-nowrap">{request.street}</span>}
          <span
            className={cn('font-bold', {
              'text-xs': request.status !== 'pending',
            })}
          >
            {request.house}
            {request.isTesting && (
              <Badge className="ml-2 border-zinc-400 text-zinc-500" variant="outline">
                Test
              </Badge>
            )}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[180px]">
        <div className="flex flex-col items-center justify-center gap-y-1">
          <div>
            <BadgeStatus
              className={cn({
                'text-[10px]': request.status !== 'pending',
              })}
              status={request.status}
            />
            {!props.isFiltered && (
              <Badge className="ml-2" variant="outline">
                {request.list}
              </Badge>
            )}
          </div>
          {request.status === 'pending' && (
            <span className="text-[10px] font-light text-balance text-center">
              Desde hace {<RelativeTimeToNow date={request.createdAt} />}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[120px] flex flex-row justify-center">
        <ActionsButton {...props} />
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;
