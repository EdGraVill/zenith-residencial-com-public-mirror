'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';

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
}

const MyRequestAction: FC<Props> = ({ lists, openRequest }) => {
  const { refresh } = useRouter();
  const [isLoading, setLoadingState] = useState(false);
  const [listName, setListName] = useState<string>('');
  const [currentRequest, setCurrentRequest] = useState<typeof privateWaterTankerRequestView.$inferSelect | null>(
    openRequest,
  );

  useEffect(() => {
    setCurrentRequest(openRequest);
  }, [openRequest]);

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

        setCurrentRequest(response);
        refresh();
      })
      .finally(() => setLoadingState(false));
  }

  if (!currentRequest) {
    return (
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Anotar mi casa</CardTitle>
          <CardDescription>En la lista:</CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardFooter>
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
