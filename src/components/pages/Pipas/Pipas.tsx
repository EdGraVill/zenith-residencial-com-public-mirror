import type { FC } from 'react';

import Auth from './Auth';
import Lists from './Lists';
import MyRequestAction from './MyRequestAction';
import { Badge } from '@/components/ui/badge';
import User from '@/controllers/User';
import WaterTankerList from '@/controllers/WaterTankerList';

const PipasPage: FC = async () => {
  const user = await User.getUserByCookies();

  if (!user) {
    return <Auth />;
  }

  const lists = await WaterTankerList.getLists();
  const waterTankerList = new WaterTankerList(user);

  return (
    <div className="container py-8">
      <header className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Lista de pipas</h1>
        <h2 className="text-2xl">UP {await user.myHouse()}</h2>
        {(await user.canBypass()) && <Badge className="bg-amber-200 text-amber-950">Admin</Badge>}
      </header>
      <nav className="my-8">
        <MyRequestAction lists={lists} openRequest={await waterTankerList.myOpenRequestPublic()} />
      </nav>
      <main className="flex flex-row gap-6">
        <Lists currentUserId={user.id} isAdmin={await user.canBypass()} lists={lists} />
      </main>
    </div>
  );
};

export default PipasPage;
