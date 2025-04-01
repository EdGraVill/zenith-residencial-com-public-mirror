import type { FC } from 'react';

import Auth from './Auth';
import Pipas from './Pipas';
import User from '@/controllers/User';
import WaterTanker from '@/controllers/WaterTankerList';

const PipasPage: FC = async () => {
  const user = await User.getUserByCookies();

  if (!user) {
    return <Auth />;
  }

  const lists = await WaterTanker.getWaterTankers();
  const waterTanker = new WaterTanker(user);

  return (
    <Pipas
      currentUserId={user.id}
      isAdmin={await waterTanker.isAdmin()}
      openRequest={await waterTanker.myOpenRequestPublic()}
      waterTankers={lists}
    />
  );
};

export default PipasPage;
