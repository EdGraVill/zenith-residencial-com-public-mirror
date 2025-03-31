import type { WaterTankerRequestsListed } from '@/controllers/WaterTankerList';
import type { privateWaterTankerRequestView } from '@/db/privateViews';

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
