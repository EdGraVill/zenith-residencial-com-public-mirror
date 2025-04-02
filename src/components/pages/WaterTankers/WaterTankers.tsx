'use client';

import { type FC, useEffect, useState } from 'react';
import type { z } from 'zod';

import AdminNoticesAction from './AdminButtons/AdminNoticesAction';
import AdminWaterTankersAction from './AdminButtons/AdminWaterTankersAction';
import NewTestingRequest from './AdminButtons/NewTestingRequest';
import NewUserAction from './AdminButtons/NewUserAction';
import MyRequestAction from './MyRequestAction';
import Notices from './Notices';
import WaterTanker from './WaterTanker';
import { getNotices, getWaterTankers, myOpenRequestPublic } from './actions';
import { Badge } from '@/components/ui/badge';
import type { WaterTankers as WaterTankersType } from '@/controllers/WaterTankerList';
import type {
  privateNoticesTable,
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
  notices: Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[];
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
  waterTankers: WaterTankersType;
}

const WaterTankers: FC<Props> = ({ currentUserId, isAdmin, notices, waterTankers, openRequest }) => {
  const [internalWaterTankers, setInternalWaterTankers] = useState<z.infer<typeof waterTankersSchema>>(
    waterTankersSchema.parse(waterTankers),
  );
  const [internalOpenRequest, setInternalOpenRequest] = useState<
    typeof privateWaterTankerRequestView.$inferSelect | null
  >(openRequest);
  const [internalNotices, setInternalNotices] =
    useState<Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[]>(notices);

  useEffect(() => {
    setInternalWaterTankers(waterTankersSchema.parse(waterTankers));
  }, [waterTankers]);

  useEffect(() => {
    setInternalOpenRequest(openRequest);
  }, [openRequest]);

  useEffect(() => {
    setInternalNotices(notices);
  }, [notices]);

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

  useEffect(() => {
    const channel = supabase
      .channel('notices_insert')
      .on<typeof privateWaterTankerRequestCommentsTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'private',
          table: 'notices',
        },
        () => {
          getNotices().then((newNotices) => setInternalNotices(newNotices));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('notices_update')
      .on<typeof privateWaterTankerRequestCommentsTable.$inferSelect>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'private',
          table: 'notices',
        },
        () => {
          getNotices().then((newNotices) => setInternalNotices(newNotices));
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
        <AdminNoticesAction isAdmin={isAdmin} notices={internalNotices} />
        <AdminWaterTankersAction isAdmin={isAdmin} waterTankers={internalWaterTankers} />
        <NewUserAction isAdmin={isAdmin} />
        <NewTestingRequest isAdmin={isAdmin} waterTankers={internalWaterTankers} />
      </aside>
      <nav className="my-8 flex flex-row flex-wrap gap-6 justify-center">
        <MyRequestAction openRequest={internalOpenRequest} waterTankers={internalWaterTankers} />
      </nav>
      <Notices notices={internalNotices} />
      <main className="flex flex-row gap-6 flex-wrap justify-evenly">
        <WaterTanker currentUserId={currentUserId} isAdmin={isAdmin} waterTankers={internalWaterTankers} />
      </main>
    </div>
  );
};

export default WaterTankers;
