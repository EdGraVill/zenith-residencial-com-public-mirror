'use server';

import User from '@/controllers/User';
import WaterTankerList from '@/controllers/WaterTankerList';

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

export async function request(listId: number) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTankerList = new WaterTankerList(user);

    await waterTankerList.requestWaterTanker(listId);
    const request = await waterTankerList.myOpenRequestPublic();

    console.log('request', request);

    return request;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export async function completeRequest(requestUUID: string) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTankerList = new WaterTankerList(user);

    if (await user.canBypass()) {
      await waterTankerList.completeRequest(requestUUID);
    } else {
      await waterTankerList.completeRequest();
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
    const waterTankerList = new WaterTankerList(user);

    if (await user.canBypass()) {
      await waterTankerList.cancelRequest(false, requestUUID);
    } else {
      await waterTankerList.cancelRequest();
    }
  } catch (error) {
    return null;
  }
}

export async function moveRequest(listId: number) {
  const user = await User.getUserByCookies();

  if (!user) {
    return null;
  }

  try {
    const waterTankerList = new WaterTankerList(user);

    await waterTankerList.moveRequestToList(listId);
  } catch (error) {
    return null;
  }
}
