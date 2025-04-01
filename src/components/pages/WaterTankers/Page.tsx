import type { FC } from 'react';

import Auth from './Auth';
import WaterTankers from './WaterTankers';
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
    <WaterTankers
      currentUserId={user.id}
      isAdmin={await waterTanker.isAdmin()}
      openRequest={await waterTanker.myOpenRequestPublic()}
      waterTankers={lists}
    />
  );
};

export default PipasPage;
