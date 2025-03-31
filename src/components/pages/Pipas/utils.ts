import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import type { Group, listsSchema } from '@/lib/schemas';

export function appendRequest(
  lists: WaterTankerRequestsListed,
  request: typeof privateWaterTankerRequestView.$inferSelect,
) {
  const listName = request.list as keyof WaterTankerRequestsListed;

  if (!lists[listName]) {
    return lists;
  }

  const clonedLists = structuredClone(lists);

  clonedLists[listName].list.push(request);

  return clonedLists;
}

export function removeRequest(lists: WaterTankerRequestsListed, requestList: string, requestUUID: string) {
  if (!lists[requestList]) {
    return lists;
  }

  const clonedLists = structuredClone(lists);

  clonedLists[requestList].list = clonedLists[requestList].list.filter((item) => item.uuid !== requestUUID);

  return clonedLists;
}

export const setListSelectedGroup =
  (lists: z.infer<typeof listsSchema>) =>
  (prevState: Record<string, string> = {}) => {
    const incomingListNames = Object.keys(lists);

    const notIncludedInPrevState = incomingListNames.filter((listName) => !prevState[listName]);
    const notIncludedInIncomingListNames = Object.keys(prevState).filter(
      (listName) => !incomingListNames.includes(listName),
    );

    if (!notIncludedInPrevState.length && !notIncludedInIncomingListNames.length) {
      return prevState;
    }

    const newState = structuredClone(prevState);

    notIncludedInPrevState.forEach((listName) => {
      newState[listName] = 'all';
    });

    notIncludedInIncomingListNames.forEach((listName) => {
      delete newState[listName];
    });

    return newState;
  };

export const updateListSelectedGroup =
  (listName: string, setGroup: Dispatch<SetStateAction<Record<string, string>>>) => (selectedGroup: string) =>
    setGroup((prevState) => {
      if (prevState[listName] === selectedGroup) {
        return prevState;
      }

      const newState = structuredClone(prevState);

      newState[listName] = selectedGroup || 'all';

      return newState;
    });

export const getBestGroup = (lists: z.infer<typeof listsSchema>, listName: string) => {
  if (!listName) {
    return 'A';
  }

  const list = lists[listName];

  const groupsCount: Record<Group, number> = list.list.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.group]: (acc[curr.group] || 0) + 1,
    }),
    {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
    },
  );

  for (const group in groupsCount) {
    if (groupsCount[group as keyof typeof groupsCount] < 6) {
      return group as Group;
    }
  }

  return 'G';
};
