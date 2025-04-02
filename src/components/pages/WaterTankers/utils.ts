import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

import type { WaterTankers } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import type { List, waterTankersSchema } from '@/lib/schemas';

export function appendRequest(waterTankers: WaterTankers, request: typeof privateWaterTankerRequestView.$inferSelect) {
  const waterTankerName = request.waterTankerName;

  if (!waterTankers[waterTankerName]) {
    return waterTankers;
  }

  const clonedWaterTankers = structuredClone(waterTankers);

  clonedWaterTankers[waterTankerName].requests.push(request);

  return clonedWaterTankers;
}

export function removeRequest(waterTankers: WaterTankers, waterTankerName: string, requestUUID: string) {
  if (!waterTankers[waterTankerName]) {
    return waterTankers;
  }

  const clonedWaterTankers = structuredClone(waterTankers);

  clonedWaterTankers[waterTankerName].requests = clonedWaterTankers[waterTankerName].requests.filter(
    (request) => request.uuid !== requestUUID,
  );

  return clonedWaterTankers;
}

export const setWaterTankerSelectedList =
  (waterTankers: z.infer<typeof waterTankersSchema>) =>
  (prevState: Record<string, List | 'all'> = {}) => {
    const waterTankerNames = Object.keys(waterTankers);

    const notIncludedInPrevState = waterTankerNames.filter((waterTankerName) => !prevState[waterTankerName]);
    const notIncludedInIncomingListNames = Object.keys(prevState).filter(
      (waterTankerName) => !waterTankerNames.includes(waterTankerName),
    );

    if (!notIncludedInPrevState.length && !notIncludedInIncomingListNames.length) {
      return prevState;
    }

    const newState = structuredClone(prevState);

    notIncludedInPrevState.forEach((waterTankerName) => {
      newState[waterTankerName] = 'all';
    });

    notIncludedInIncomingListNames.forEach((waterTankerName) => {
      delete newState[waterTankerName];
    });

    return newState;
  };

export const updateWaterTankerSelectedList =
  (waterTankerName: string, setSelectedList: Dispatch<SetStateAction<Record<string, List | 'all'>>>) =>
  (selectedList: List | 'all') =>
    setSelectedList((prevState) => {
      if (prevState[waterTankerName] === selectedList) {
        return prevState;
      }

      const newState = structuredClone(prevState);

      newState[waterTankerName] = selectedList || 'all';

      return newState;
    });

export const setWaterTankerShowNonPending =
  (waterTankers: z.infer<typeof waterTankersSchema>) =>
  (prevState: Record<string, boolean> = {}) => {
    const waterTankerNames = Object.keys(waterTankers);

    const notIncludedInPrevState = waterTankerNames.filter((waterTankerName) => !prevState[waterTankerName]);
    const notIncludedInIncomingListNames = Object.keys(prevState).filter(
      (waterTankerName) => !waterTankerNames.includes(waterTankerName),
    );

    if (!notIncludedInPrevState.length && !notIncludedInIncomingListNames.length) {
      return prevState;
    }

    const newState = structuredClone(prevState);

    notIncludedInPrevState.forEach((waterTankerName) => {
      newState[waterTankerName] = false;
    });

    notIncludedInIncomingListNames.forEach((waterTankerName) => {
      delete newState[waterTankerName];
    });

    return newState;
  };

export const updateWaterTankerShowNonPending =
  (waterTankerName: string, setShowNonPending: Dispatch<SetStateAction<Record<string, boolean>>>) =>
  (showNonPending: boolean) =>
    setShowNonPending((prevState) => {
      if (prevState[waterTankerName] === showNonPending) {
        return prevState;
      }

      const newState = structuredClone(prevState);
      newState[waterTankerName] = showNonPending;

      return newState;
    });

export const getBestList = (waterTankers: z.infer<typeof waterTankersSchema>, waterTankerName: string) => {
  if (!waterTankerName) {
    return '1';
  }

  const list = waterTankers[waterTankerName];

  const listCount: Record<List, number> = list.requests.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.list]: (acc[curr.list] || 0) + 1,
    }),
    {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
    },
  );

  for (const list in listCount) {
    if (listCount[list as keyof typeof listCount] < 6) {
      return list as List;
    }
  }

  return '7';
};
