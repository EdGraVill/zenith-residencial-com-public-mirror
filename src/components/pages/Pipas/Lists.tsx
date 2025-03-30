'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import type { ComponentProps, Dispatch, FC, SetStateAction } from 'react';

import { cancelRequest, completeRequest, moveRequest } from './actions';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestStatusEnum } from '@/db/privateSchema';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import { cn } from '@/lib/utils';

interface BadgeStatusProps extends ComponentProps<typeof Badge> {
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

const BadgeStatus: FC<BadgeStatusProps> = ({ status, className, ...props }) => (
  <Badge className={cn(mapStatusToClassname[status], className)} {...props}>
    {mapStatusToText[status]}
  </Badge>
);

interface ListsProps {
  currentUserId: number;
  isAdmin: boolean;
  lists: WaterTankerRequestsListed;
  setOwnRequest: Dispatch<SetStateAction<typeof privateWaterTankerRequestView.$inferSelect | null>>;
}

const Lists: FC<ListsProps> = ({ currentUserId, isAdmin, lists, setOwnRequest }) => {
  const [isLoading, setLoadingState] = useState(false);
  const listNames = Object.keys(lists);

  function onComplete(requestUUID: string) {
    setLoadingState(true);
    completeRequest(requestUUID).finally(() => {
      setLoadingState(false);
      setOwnRequest(null);
    });
  }

  function onCancel(requestUUID: string) {
    setLoadingState(true);
    cancelRequest(requestUUID).finally(() => {
      setLoadingState(false);
      setOwnRequest(null);
    });
  }

  function onMove(listName: string) {
    setLoadingState(true);
    moveRequest(lists[listName].id).finally(() => {
      setLoadingState(false);
    });
  }

  const onValueChange = (requestUUID: string) => (value: string) => {
    if (value === 'action:complete') {
      onComplete(requestUUID);
    } else if (value === 'action:cancel') {
      onCancel(requestUUID);
    } else {
      onMove(value);
    }
  };

  return (
    <>
      {Object.keys(lists).map((listName) => {
        const list = lists[listName];

        return (
          <div className="max-w-md" key={list.id}>
            <header className="flex flex-col items-center">
              <h3 className="text-xl">{list.name}</h3>
              <p className="text-sm p-2 text-balance bg-zinc-100 w-full">{list.description}</p>
            </header>
            <Table className="border">
              <TableHeader>
                <TableRow className="bg-black hover:bg-black">
                  <TableHead className="text-center font-semibold text-white">UP</TableHead>
                  <TableHead className="text-center font-semibold text-white">Estado</TableHead>
                  <TableHead className="text-center font-semibold text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!list.list.length && (
                  <TableRow>
                    <TableCell className="text-center w-[404px]" colSpan={3}>
                      <span className="text-sm font-light text-balance">Sin solicitudes para mostrar</span>
                    </TableCell>
                  </TableRow>
                )}
                {list.list.map((request) => (
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
                      {request.requestStatus === 'pending' ? (
                        <Select
                          disabled={isLoading || (currentUserId !== request.house && !isAdmin)}
                          onValueChange={onValueChange(request.uuid)}
                          value=""
                        >
                          <SelectTrigger className="w-[100px]">Acciones</SelectTrigger>
                          <SelectContent>
                            <SelectItem value="action:complete">✅ Completar</SelectItem>
                            <SelectItem value="action:cancel">❌ Cancelar</SelectItem>
                            {currentUserId === request.house && (
                              <SelectGroup>
                                <SelectLabel>Mover a</SelectLabel>
                                {listNames
                                  .filter((name) => name !== list.name)
                                  .map((name) => (
                                    <SelectItem key={name} value={name}>
                                      {name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-[10px] font-light text-center w-full inline-block">
                          Hace {formatDistanceToNow(request.updatedAt, { locale: es })}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default Lists;
