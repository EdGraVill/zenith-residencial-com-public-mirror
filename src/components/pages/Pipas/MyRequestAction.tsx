'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { FC } from 'react';
import type { z } from 'zod';

import { cancelRequest, request } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import type { listsSchema } from '@/lib/schemas';

interface Props {
  lists: z.infer<typeof listsSchema>;
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
}

const MyRequestAction: FC<Props> = ({ lists, openRequest }) => {
  const [isLoading, setLoadingState] = useState(false);
  const [listName, setListName] = useState<string>('');

  function onRequest() {
    const list = lists[listName];

    if (!list) {
      return;
    }

    setLoadingState(true);
    request(list.id)
      .then((response) => {
        if (!response) {
          return;
        }

        setListName('');
      })
      .finally(() => setLoadingState(false));
  }

  function onRemove() {
    setLoadingState(true);
    if (openRequest) {
      cancelRequest(openRequest.uuid).finally(() => setLoadingState(false));
    }
  }

  function onGoToList() {
    if (openRequest) {
      const listElement = document.querySelector(`[data-list-name="${openRequest.list}"]`);

      if (listElement) {
        window.scrollTo({
          behavior: 'smooth',
          top: listElement.getBoundingClientRect().top + window.scrollY - 100,
        });
      }
    }
  }

  return (
    <Card className="w-[405px]">
      <CardContent className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex">{openRequest ? 'Casa anotada' : 'Anotar mi casa'}</CardTitle>
          <CardDescription className="flex">en la lista:</CardDescription>
        </div>
        <Select disabled={!!openRequest} onValueChange={setListName} value={openRequest ? openRequest.list : listName}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecciona una lista" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(lists).map((listName) => (
              <SelectItem key={listName} value={listName}>
                {listName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-center gap-x-4">
        {openRequest ? (
          <>
            <CardAction>
              <Button disabled={isLoading} onClick={onGoToList} variant="outline">
                Ver lista
              </Button>
            </CardAction>
            <CardAction>
              <Button disabled={isLoading} onClick={onRemove} variant="destructive">
                Quitarme
              </Button>
            </CardAction>
          </>
        ) : (
          <CardAction>
            <Button disabled={isLoading} onClick={onRequest}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Anotarme'}
            </Button>
          </CardAction>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyRequestAction;
