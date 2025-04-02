import type { FC } from 'react';

import Auth from './Auth';
import WaterTankers from './WaterTankers';
import Notice from '@/controllers/Notice';
import User from '@/controllers/User';
import WaterTanker from '@/controllers/WaterTankerList';

const PipasPage: FC = async () => {
  const user = await User.getUserByCookies();

  if (!user) {
    return <Auth />;
  }

  const lists = await WaterTanker.getWaterTankers();
  const waterTanker = new WaterTanker(user);
  const notices = await Notice.getNotices();

  return (
    <WaterTankers
      currentUserId={user.id}
      isAdmin={await waterTanker.isAdmin()}
      notices={notices}
      openRequest={await waterTanker.myOpenRequestPublic()}
      waterTankers={lists}
    />
  );
};

export default PipasPage;
