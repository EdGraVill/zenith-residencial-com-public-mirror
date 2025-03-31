import { type FC, useEffect, useState } from 'react';
import type { z } from 'zod';

import RequestRow from './RequestRow';
import { setListSelectedGroup, updateListSelectedGroup } from './utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { listsSchema } from '@/lib/schemas';

interface ListsProps {
  currentUserId: number;
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
}

const Lists: FC<ListsProps> = ({ currentUserId, isAdmin, lists }) => {
  const [selectedGroup, setSelectedGroup] = useState<Record<string, string>>(setListSelectedGroup(lists)());

  useEffect(() => {
    setSelectedGroup(setListSelectedGroup(lists)());
  }, [lists]);

  return (
    <>
      {Object.keys(lists).map((listName) => {
        const list = lists[listName];
        const currentGroup = selectedGroup[listName];

        const filteredList = list.list.filter(({ group }) => currentGroup === 'all' || currentGroup === group);

        return (
          <div className="max-w-md" data-list-name={listName} key={list.id}>
            <header className="flex flex-col items-center">
              <h3 className="text-xl">{list.name}</h3>
              <p className="text-sm p-2 text-balance bg-zinc-100 w-full">{list.description}</p>
              <ToggleGroup
                className="w-full"
                onValueChange={updateListSelectedGroup(listName, setSelectedGroup)}
                type="single"
                value={currentGroup}
              >
                <ToggleGroupItem
                  aria-label="Todos"
                  className="data-[state=on]:bg-black data-[state=on]:text-white first:rounded-none flex flex-col items-center gap-0"
                  value="all"
                >
                  <span className="text-sm/3">Todos</span>
                  <span className="text-[9px]">{list.list.length}</span>
                </ToggleGroupItem>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                  <ToggleGroupItem
                    aria-label={letter}
                    className="data-[state=on]:bg-black data-[state=on]:text-white last:rounded-none flex flex-col items-center gap-0"
                    key={letter}
                    value={letter}
                  >
                    <span className="text-sm/3">{letter}</span>
                    <span className="text-[9px]">{list.list.filter(({ group }) => group === letter).length}</span>
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
                {!filteredList.length && (
                  <TableRow>
                    <TableCell className="text-center w-[404px]" colSpan={3}>
                      <span className="text-sm font-light text-balance">
                        Sin solicitudes para mostrar{currentGroup !== 'all' && ` en la lista ${currentGroup}`}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {filteredList.map((request) => (
                  <RequestRow
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    isFiltered={currentGroup !== 'all'}
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
};

export default Lists;
