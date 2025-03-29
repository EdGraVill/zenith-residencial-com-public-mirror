'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Dispatch, FC, SetStateAction } from 'react';

import { request } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestView } from '@/db/privateViews';

interface Props {
  lists: WaterTankerRequestsListed;
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
  setOwnRequest: Dispatch<SetStateAction<typeof privateWaterTankerRequestView.$inferSelect | null>>;
}

const MyRequestAction: FC<Props> = ({ lists, openRequest, setOwnRequest }) => {
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

        setOwnRequest(response);
        setListName('');
      })
      .finally(() => setLoadingState(false));
  }

  if (!openRequest) {
    return (
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Anotar mi casa</CardTitle>
          <CardDescription>En la lista:</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Select onValueChange={setListName} value={listName}>
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
        <CardFooter className="flex justify-end">
          <CardAction>
            <Button disabled={isLoading} onClick={onRequest}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Anotar'}
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    );
  }
};

export default MyRequestAction;
