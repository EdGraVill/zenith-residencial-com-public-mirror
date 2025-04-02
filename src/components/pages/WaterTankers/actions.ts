'use server';

import Notice from '@/controllers/Notice';
import User from '@/controllers/User';
import WaterTanker from '@/controllers/WaterTankerList';
import type { privateNoticesTable } from '@/db/privateSchema';
import type { List } from '@/lib/schemas';

export async function auth(phone: string) {
  try {
    const user = await User.getUserByPhone(phone);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function createRequest(waterTankerId: number, list: List) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    await waterTanker.createRequest(waterTankerId, list);
    const request = await waterTanker.myOpenRequestPublic();

    return request;
  } catch (error) {
    return null;
  }
}

export async function completeRequest(requestUUID: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    if (await user.canBypass()) {
      await waterTanker.completeRequest(requestUUID);
    } else {
      await waterTanker.completeRequest();
    }
  } catch (error) {
    return null;
  }
}

export async function cancelRequest(requestUUID: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    if (await user.canBypass()) {
      await waterTanker.cancelRequest(false, requestUUID);
    } else {
      await waterTanker.cancelRequest();
    }
  } catch (error) {
    return null;
  }
}

export async function moveRequestToWaterTanker(waterTankerId: number, requestUUID?: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    await waterTanker.moveRequestToWaterTanker(waterTankerId, requestUUID);
  } catch (error) {
    return null;
  }
}

export async function getWaterTankers() {
  const user = await User.getUserByCookies();

  if (!user) {
    return {};
  }

  const waterTankers = await WaterTanker.getWaterTankers();

  return waterTankers;
}

export async function createWaterTanker(name: string, description: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    await waterTanker.createWaterTanker(name, description);
  } catch (error) {
    return null;
  }
}

export async function registerUser(phone: string, house: number) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    await User.register(phone, house);
  } catch (error) {
    return null;
  }
}

export async function myOpenRequestPublic() {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    const openRequest = await waterTanker.myOpenRequestPublic();

    return openRequest;
  } catch (error) {
    return null;
  }
}

export async function addComment(comment: string, requestUUID: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    await waterTanker.addComment(comment, requestUUID);
  } catch (error) {
    return null;
  }
}

export async function addTestingRequest(house: number, waterTankerId: number, list: List) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  const waterTankerList = new WaterTanker(user);

  if (!(await waterTankerList.isAdmin())) {
    return null;
  }

  await waterTankerList.addTestingRequest(house, waterTankerId, list);
}

export async function moveRequestToList(list: List, requestUUID: string) {
  const supportedLists = ['1', '2', '3', '4', '5', '6', '7'] as const;

  if (!supportedLists.includes(list)) {
    return null;
  }

  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    if (await waterTanker.isAdmin()) {
      await waterTanker.moveRequestToList(list, requestUUID);
    } else {
      await waterTanker.moveRequestToList(list);
    }
  } catch (error) {
    return null;
  }
}

export async function updateWaterTanker(waterTankerId: number, name: string, description: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    return waterTanker.updateWaterTanker(waterTankerId, name, description);
  } catch (error) {
    return null;
  }
}

export async function removeWaterTanker(waterTankerId: number) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTanker = new WaterTanker(user);

    await waterTanker.removeWaterTanker(waterTankerId);
  } catch (error) {
    return null;
  }
}

export async function getNotices() {
  const user = await User.getUserByCookies();

  if (!user) {
    return [] as Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[];
  }

  try {
    const notices = await Notice.getNotices();

    return notices;
  } catch (error) {
    return [] as Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[];
  }
}

export async function createNotice(notice: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const noticeInstance = new Notice(user);

    await noticeInstance.createNotice(notice);
  } catch (error) {
    return null;
  }
}

export async function updateNotice(noticeId: number, notice: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const noticeInstance = new Notice(user);

    await noticeInstance.updateNotice(noticeId, notice);
  } catch (error) {
    return null;
  }
}

export async function removeNotice(noticeId: number) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const noticeInstance = new Notice(user);

    await noticeInstance.removeNotice(noticeId);
  } catch (error) {
    return null;
  }
}
