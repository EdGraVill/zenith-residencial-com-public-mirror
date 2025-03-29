'use client';

import { type FC, useEffect, useState } from 'react';

import Lists from './Lists';
import MyRequestAction from './MyRequestAction';
import NewListAction from './NewListAction';
import NewUserAction from './NewUserAction';
import { getLists } from './actions';
import { Badge } from '@/components/ui/badge';
import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestTable } from '@/db/privateSchema';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import supabase from '@/utils/supabase/client';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  lists: WaterTankerRequestsListed;
  ownRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
}

const Pipas: FC<Props> = ({ currentUserId, isAdmin, lists, ownRequest }) => {
  const [internalLists, setInternalLists] = useState<WaterTankerRequestsListed>(lists);
  const [internalOwnRequest, setInternalOwnRequest] = useState<
    typeof privateWaterTankerRequestView.$inferSelect | null
  >(ownRequest);

  useEffect(() => {
    setInternalLists(lists);
  }, [lists]);

  useEffect(() => {
    setInternalOwnRequest(ownRequest);
  }, [ownRequest]);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_request_list_insert')
      .on<typeof privateWaterTankerRequestTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'water_tanker_request_list',
        },
        () => {
          getLists().then((newLists) => setInternalLists(newLists));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_request_insert')
      .on<typeof privateWaterTankerRequestTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'water_tanker_request',
        },
        () => {
          getLists().then((newLists) => setInternalLists(newLists));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_request_update')
      .on<typeof privateWaterTankerRequestTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'private',
          table: 'water_tanker_request',
        },
        () => {
          getLists().then((newLists) => setInternalLists(newLists));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container py-8">
      <header className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Lista de pipas</h1>
        <h2 className="text-2xl">UP {currentUserId}</h2>
        {isAdmin && <Badge className="bg-amber-200 text-amber-950">Admin</Badge>}
      </header>
      <nav className="my-8 flex flex-row flex-wrap gap-6">
        <MyRequestAction lists={internalLists} openRequest={internalOwnRequest} setOwnRequest={setInternalOwnRequest} />
        <NewListAction isAdmin={isAdmin} />
        <NewUserAction isAdmin={isAdmin} />
      </nav>
      <main className="flex flex-row gap-6 flex-wrap">
        <Lists
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          lists={internalLists}
          setOwnRequest={setInternalOwnRequest}
        />
      </main>
    </div>
  );
};

export default Pipas;
