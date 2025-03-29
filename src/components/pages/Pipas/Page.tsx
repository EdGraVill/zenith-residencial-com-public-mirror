import type { FC } from 'react';

import Auth from './Auth';
import Pipas from './Pipas';
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
    <Pipas
      currentUserId={user.id}
      isAdmin={await waterTankerList.isAdmin()}
      lists={lists}
      ownRequest={await waterTankerList.myOpenRequestPublic()}
    />
  );
};

export default PipasPage;
