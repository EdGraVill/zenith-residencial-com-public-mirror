'use client';

import { type FC, useEffect, useId, useState } from 'react';
import type { z } from 'zod';

import RequestRow from './RequestRow';
import {
  setWaterTankerSelectedList,
  setWaterTankerShowNonPending,
  updateWaterTankerSelectedList,
  updateWaterTankerShowNonPending,
} from './utils';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { List, waterTankersSchema } from '@/lib/schemas';

interface ListsProps {
  currentUserId: number;
  isAdmin: boolean;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const WaterTanker: FC<ListsProps> = ({ currentUserId, isAdmin, waterTankers }) => {
  const [showNonPending, setShowNonPending] = useState<Record<string, boolean>>(
    setWaterTankerShowNonPending(waterTankers)(),
  );
  const [selectedList, setSelectedList] = useState<Record<string, List | 'all'>>(
    setWaterTankerSelectedList(waterTankers)(),
  );

  const switchId = useId();

  useEffect(() => {
    setSelectedList(setWaterTankerSelectedList(waterTankers));
  }, [waterTankers]);

  useEffect(() => {
    setShowNonPending(setWaterTankerShowNonPending(waterTankers));
  }, [waterTankers]);

  return (
    <>
      {Object.keys(waterTankers).map((waterTankerName) => {
        const waterTanker = waterTankers[waterTankerName];
        const currentList = selectedList[waterTankerName];

        const filteredRequests = waterTanker.requests
          .filter(({ list }) => currentList === 'all' || currentList === list)
          .filter(({ status }) => status === 'pending' || showNonPending[waterTankerName]);

        return (
          <div className="max-w-md" data-water-tanker-name={waterTankerName} key={waterTanker.id}>
            <header className="flex flex-col items-center">
              <h3 className="text-xl">{waterTanker.name}</h3>
              <p className="text-sm p-2 text-balance bg-zinc-100 w-full">{waterTanker.description}</p>
              <ToggleGroup
                className="w-full"
                onValueChange={updateWaterTankerSelectedList(waterTankerName, setSelectedList)}
                type="single"
                value={currentList}
              >
                <ToggleGroupItem
                  aria-label="Todos"
                  className="data-[state=on]:bg-black data-[state=on]:text-white first:rounded-none flex flex-col items-center gap-0"
                  value="all"
                >
                  <span className="text-sm/3">Todos</span>
                  <span className="text-[9px]">
                    {
                      waterTanker.requests.filter(
                        ({ status }) => status === 'pending' || showNonPending[waterTankerName],
                      ).length
                    }
                  </span>
                </ToggleGroupItem>
                {['1', '2', '3', '4', '5', '6', '7'].map((list) => (
                  <ToggleGroupItem
                    aria-label={list}
                    className="data-[state=on]:bg-black data-[state=on]:text-white last:rounded-none flex flex-col items-center gap-0"
                    key={list}
                    value={list}
                  >
                    <span className="text-sm/3">{list}</span>
                    <span className="text-[9px]">
                      {
                        waterTanker.requests
                          .filter((request) => request.list === list)
                          .filter(({ status }) => status === 'pending' || showNonPending[waterTankerName]).length
                      }
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </header>
            <Table className="border border-t-0">
              <TableHeader className="border border-black">
                <TableRow className="bg-black hover:bg-black">
                  <TableHead className="text-center font-semibold text-white">UP</TableHead>
                  <TableHead className="text-center font-semibold text-white">Estado</TableHead>
                  <TableHead className="text-center font-semibold text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredRequests.length && (
                  <TableRow>
                    <TableCell className="text-center w-[404px]" colSpan={3}>
                      <span className="text-sm font-light text-balance">
                        Sin solicitudes para mostrar{currentList !== 'all' && ` en la lista ${currentList}`}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {filteredRequests.map((request) => (
                  <RequestRow
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    isFiltered={currentList !== 'all'}
                    key={request.uuid}
                    request={request}
                    waterTankers={waterTankers}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex items-center justify-end gap-6 py-2">
                      <Label className="text-xs" htmlFor={switchId}>
                        Mostrar <Badge className="bg-red-100 text-red-800 opacity-50 scale-75 -m-2">Cancelados</Badge> y{' '}
                        <Badge className="bg-green-100 text-green-800 opacity-50 scale-75 -m-2">Completados</Badge>
                      </Label>
                      <Switch
                        checked={showNonPending[waterTankerName]}
                        id={switchId}
                        onCheckedChange={updateWaterTankerShowNonPending(waterTankerName, setShowNonPending)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default WaterTanker;
