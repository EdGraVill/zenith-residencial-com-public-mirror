import type { FC } from 'react';
import type { z } from 'zod';

import RequestRow from './RequestRow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { listsSchema } from '@/lib/schemas';

interface ListsProps {
  currentUserId: number;
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
}

const Lists: FC<ListsProps> = ({ currentUserId, isAdmin, lists }) => (
  <>
    {Object.keys(lists).map((listName) => {
      const list = lists[listName];

      return (
        <div className="max-w-md" data-list-name={listName} key={list.id}>
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
                <RequestRow
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  key={request.uuid}
                  lists={lists}
                  request={request}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      );
    })}
  </>
);

export default Lists;
