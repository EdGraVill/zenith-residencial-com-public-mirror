'use client';

import { type FC, useEffect, useState } from 'react';
import type { z } from 'zod';

import Lists from './Lists';
import MyRequestAction from './MyRequestAction';
import NewListAction from './NewListAction';
import NewUserAction from './NewUserAction';
import { getLists, getOwnRequest } from './actions';
import { Badge } from '@/components/ui/badge';
import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestTable } from '@/db/privateSchema';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import { listsSchema } from '@/lib/schemas';
import supabase from '@/utils/supabase/client';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  lists: WaterTankerRequestsListed;
  ownRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
}

const Pipas: FC<Props> = ({ currentUserId, isAdmin, lists, ownRequest }) => {
  const [internalLists, setInternalLists] = useState<z.infer<typeof listsSchema>>(listsSchema.parse(lists));
  const [internalOwnRequest, setInternalOwnRequest] = useState<
    typeof privateWaterTankerRequestView.$inferSelect | null
  >(ownRequest);

  useEffect(() => {
    setInternalLists(listsSchema.parse(lists));
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
          getLists().then((newLists) => setInternalLists(listsSchema.parse(newLists)));
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
          getLists().then((newLists) => setInternalLists(listsSchema.parse(newLists)));
          getOwnRequest().then((newOwnRequest) => setInternalOwnRequest(newOwnRequest));
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
          getLists().then((newLists) => setInternalLists(listsSchema.parse(newLists)));
          getOwnRequest().then((newOwnRequest) => setInternalOwnRequest(newOwnRequest));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_request_comments_insert')
      .on<typeof privateWaterTankerRequestTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'water_tanker_request_comments',
        },
        () => {
          getLists().then((newLists) => setInternalLists(listsSchema.parse(newLists)));
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
      <aside className="my-8 flex flex-row gap-4 flex-wrap justify-center">
        <NewListAction isAdmin={isAdmin} />
        <NewUserAction isAdmin={isAdmin} />
      </aside>
      <nav className="my-8 flex flex-row flex-wrap gap-6 justify-center">
        <MyRequestAction lists={internalLists} openRequest={internalOwnRequest} />
      </nav>
      <main className="flex flex-row gap-6 flex-wrap justify-evenly">
        <Lists currentUserId={currentUserId} isAdmin={isAdmin} lists={internalLists} />
      </main>
    </div>
  );
};

export default Pipas;
