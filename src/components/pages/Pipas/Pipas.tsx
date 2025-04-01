'use client';

import { type FC, useEffect, useState } from 'react';
import type { z } from 'zod';

import Lists from './Lists';
import MyRequestAction from './MyRequestAction';
import NewTestingRequest from './NewTestingRequest';
import NewUserAction from './NewUserAction';
import NewWaterTankerAction from './NewWaterTankerAction';
import { getWaterTankers, myOpenRequestPublic } from './actions';
import { Badge } from '@/components/ui/badge';
import type { WaterTankers } from '@/controllers/WaterTankerList';
import type {
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestTable,
  privateWaterTankerTable,
} from '@/db/privateSchema';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import { waterTankersSchema } from '@/lib/schemas';
import supabase from '@/utils/supabase/client';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
  waterTankers: WaterTankers;
}

const Pipas: FC<Props> = ({ currentUserId, isAdmin, waterTankers, openRequest }) => {
  const [internalWaterTankers, setInternalWaterTankers] = useState<z.infer<typeof waterTankersSchema>>(
    waterTankersSchema.parse(waterTankers),
  );
  const [internalOpenRequest, setInternalOpenRequest] = useState<
    typeof privateWaterTankerRequestView.$inferSelect | null
  >(openRequest);

  useEffect(() => {
    setInternalWaterTankers(waterTankersSchema.parse(waterTankers));
  }, [waterTankers]);

  useEffect(() => {
    setInternalOpenRequest(openRequest);
  }, [openRequest]);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_insert')
      .on<typeof privateWaterTankerTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'water_tanker',
        },
        () => {
          getWaterTankers().then((newWaterTankers) =>
            setInternalWaterTankers(waterTankersSchema.parse(newWaterTankers)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('water_tanker_update')
      .on<typeof privateWaterTankerTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'private',
          table: 'water_tanker',
        },
        () => {
          getWaterTankers().then((newWaterTankers) =>
            setInternalWaterTankers(waterTankersSchema.parse(newWaterTankers)),
          );
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
          getWaterTankers().then((newWaterTankers) =>
            setInternalWaterTankers(waterTankersSchema.parse(newWaterTankers)),
          );
          myOpenRequestPublic().then((newOpenRequest) => setInternalOpenRequest(newOpenRequest));
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
          getWaterTankers().then((newWaterTankers) =>
            setInternalWaterTankers(waterTankersSchema.parse(newWaterTankers)),
          );
          myOpenRequestPublic().then((newOpenRequest) => setInternalOpenRequest(newOpenRequest));
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
      .on<typeof privateWaterTankerRequestCommentsTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'water_tanker_request_comments',
        },
        () => {
          getWaterTankers().then((newWaterTankers) =>
            setInternalWaterTankers(waterTankersSchema.parse(newWaterTankers)),
          );
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
        <h1 className="text-3xl font-bold">Listas de pipas</h1>
        <h2 className="text-2xl">UP {currentUserId}</h2>
        {isAdmin && <Badge className="bg-amber-200 text-amber-950">Admin</Badge>}
      </header>
      <aside className="my-8 flex flex-row gap-4 flex-wrap justify-center">
        <NewWaterTankerAction isAdmin={isAdmin} />
        <NewUserAction isAdmin={isAdmin} />
        <NewTestingRequest isAdmin={isAdmin} waterTankers={internalWaterTankers} />
      </aside>
      <nav className="my-8 flex flex-row flex-wrap gap-6 justify-center">
        <MyRequestAction openRequest={internalOpenRequest} waterTankers={internalWaterTankers} />
      </nav>
      <main className="flex flex-row gap-6 flex-wrap justify-evenly">
        <Lists currentUserId={currentUserId} isAdmin={isAdmin} waterTankers={internalWaterTankers} />
      </main>
    </div>
  );
};

export default Pipas;
