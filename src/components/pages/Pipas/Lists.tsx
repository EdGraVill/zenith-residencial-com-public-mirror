'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';

import { cancelRequest, completeRequest, moveRequest } from './actions';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestStatusEnum } from '@/db/privateSchema';
import { cn } from '@/lib/utils';

interface BadgeStatusProps {
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

const BadgeStatus: FC<BadgeStatusProps> = ({ status }) => (
  <Badge className={mapStatusToClassname[status]}>{mapStatusToText[status]}</Badge>
);

interface ListsProps {
  currentUserId: number;
  isAdmin: boolean;
  lists: WaterTankerRequestsListed;
}

const Lists: FC<ListsProps> = ({ currentUserId, isAdmin, lists }) => {
  const [isLoading, setLoadingState] = useState(false);
  const { refresh } = useRouter();
  const listNames = Object.keys(lists);

  function onComplete(requestUUID: string) {
    setLoadingState(true);
    completeRequest(requestUUID).finally(() => {
      setLoadingState(false);
      refresh();
    });
  }

  function onCancel(requestUUID: string) {
    setLoadingState(true);
    cancelRequest(requestUUID).finally(() => {
      setLoadingState(false);
      refresh();
    });
  }

  function onMove(listName: string) {
    setLoadingState(true);
    moveRequest(lists[listName].id).finally(() => {
      setLoadingState(false);
      refresh();
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
              <h3 className="text-xl font-bold">{list.name}</h3>
              <p className="text-sm p-2 text-balance bg-zinc-100 m-2 rounded-lg">{list.description}</p>
            </header>
            <Table>
              <TableHeader>
                <TableRow className="bg-black hover:bg-black">
                  <TableHead className="text-center font-semibold text-white max-w-[80px]">Creación</TableHead>
                  <TableHead className="text-center font-semibold text-white">UP</TableHead>
                  <TableHead className="text-center font-semibold text-white">Estado</TableHead>
                  <TableHead className="text-center font-semibold text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.list.map((request) => {
                  console.log(request);

                  return (
                    <TableRow className={cn({ 'bg-blue-50': currentUserId === request.house })} key={request.uuid}>
                      <TableCell className="text-center text-xs max-w-[80px]">
                        <span className="text-balance">
                          {formatDistanceToNow(request.createdAt, { addSuffix: true, locale: es })}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold">{request.house}</TableCell>
                      <TableCell className="text-center">
                        <BadgeStatus status={request.requestStatus} />
                      </TableCell>
                      <TableCell>
                        {request.requestStatus !== 'pending' || (currentUserId !== request.house && !isAdmin) ? (
                          <Select disabled={true}>
                            <SelectTrigger className="w-[100px]">Acciones</SelectTrigger>
                          </Select>
                        ) : (
                          <Select disabled={isLoading} onValueChange={onValueChange(request.uuid)} value="">
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
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default Lists;
