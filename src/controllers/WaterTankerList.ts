import { and, eq } from 'drizzle-orm';

import type User from './User';
import { db } from '@/db';
import { hiddenWaterTankerRequestHRTable } from '@/db/hiddenSchema';
import {
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestListTable,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
} from '@/db/privateSchema';
import { privateWaterTankerRequestView } from '@/db/privateViews';

export type WaterTankerRequestsListed = Record<
  string,
  {
    description: string;
    id: number;
    list: Array<typeof privateWaterTankerRequestView.$inferSelect>;
    name: string;
  }
>;

export default class WaterTankerList {
  public static async getLists(): Promise<WaterTankerRequestsListed> {
    const waterTankerRequestListTable = await db.select().from(privateWaterTankerRequestListTable);

    const waterTankerRequestView = await db.select().from(privateWaterTankerRequestView);
    const waterTankerRequestsListed: WaterTankerRequestsListed = waterTankerRequestListTable.reduce(
      (acc, list) => ({
        ...acc,
        [list.name]: {
          description: list.description,
          id: list.id,
          list: waterTankerRequestView.filter((l) => l.list === list.name),
          name: list.name,
        },
      }),
      {},
    );

    return waterTankerRequestsListed;
  }

  constructor(public readonly user: User) {}

  public async isAdmin() {
    return this.user.canBypass();
  }

  public async createList(name: string, description: string) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const waterTankerListTable = await db
      .insert(privateWaterTankerRequestListTable)
      .values({
        description,
        name,
      })
      .returning();

    return waterTankerListTable[0];
  }

  public async myOpenRequest() {
    const alreadyInWaterTankerRequestView = await db
      .select()
      .from(privateWaterTankerRequestTable)
      .where(
        and(
          eq(privateWaterTankerRequestTable.userId, this.user.id),
          eq(privateWaterTankerRequestTable.isActive, true),
          eq(privateWaterTankerRequestTable.requestStatus, privateWaterTankerRequestStatusEnum.enumValues[0]),
          eq(privateWaterTankerRequestTable.isTesting, false),
        ),
      )
      .limit(1);

    if (!alreadyInWaterTankerRequestView.length) {
      return null;
    }

    return alreadyInWaterTankerRequestView[0];
  }

  public async myOpenRequestPublic() {
    const alreadyInWaterTankerRequestView = await db
      .select()
      .from(privateWaterTankerRequestView)
      .where(
        and(
          eq(privateWaterTankerRequestView.house, this.user.id),
          eq(privateWaterTankerRequestView.requestStatus, privateWaterTankerRequestStatusEnum.enumValues[0]),
          eq(privateWaterTankerRequestView.isTesting, false),
        ),
      )
      .limit(1);

    if (!alreadyInWaterTankerRequestView.length) {
      return null;
    }

    return alreadyInWaterTankerRequestView[0];
  }

  public async requestWaterTanker(listId: number) {
    const openRequest = await this.myOpenRequest();

    if (openRequest) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestTable = await db
      .insert(privateWaterTankerRequestTable)
      .values({
        userId: this.user.id,
        waterTankerRequestListId: listId,
      })
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    return waterTankerRequestTable[0];
  }

  public async completeRequest(requestUUID?: string) {
    const isAdmin = await this.isAdmin();

    let requestId: number | null = null;

    if (isAdmin && requestUUID) {
      const waterTankerRequestTable = await db
        .select()
        .from(privateWaterTankerRequestTable)
        .where(eq(privateWaterTankerRequestTable.uuid, requestUUID))
        .limit(1);

      requestId = waterTankerRequestTable[0]?.id ?? null;
    } else if (!isAdmin && requestId) {
      throw new Error('Forbidden');
    } else {
      const openRequest = await this.myOpenRequest();

      requestId = openRequest?.id ?? null;
    }

    if (!requestId) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestTable = await db
      .update(privateWaterTankerRequestTable)
      .set({
        requestStatus: privateWaterTankerRequestStatusEnum.enumValues[1],
      })
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      requestStatus: privateWaterTankerRequestStatusEnum.enumValues[1],
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    return waterTankerRequestTable[0];
  }

  public async cancelRequest(isRemoved = false, requestUUID?: string) {
    const isAdmin = await this.isAdmin();

    let requestId: number | null = null;

    if (isAdmin && requestUUID) {
      const waterTankerRequestTable = await db
        .select()
        .from(privateWaterTankerRequestTable)
        .where(eq(privateWaterTankerRequestTable.uuid, requestUUID))
        .limit(1);

      requestId = waterTankerRequestTable[0]?.id ?? null;
    } else if (!isAdmin && requestId) {
      throw new Error('Forbidden');
    } else {
      const openRequest = await this.myOpenRequest();

      requestId = openRequest?.id ?? null;
    }

    if (!requestId) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestTable = await db
      .update(privateWaterTankerRequestTable)
      .set({
        isActive: !isRemoved,
        requestStatus: privateWaterTankerRequestStatusEnum.enumValues[2],
      })
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      requestStatus: privateWaterTankerRequestStatusEnum.enumValues[2],
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    return waterTankerRequestTable[0];
  }

  public async moveRequestToList(listId: number) {
    const openRequest = await this.myOpenRequest();

    if (!openRequest) {
      throw new Error('Forbidden');
    }

    const canceledRequest = await this.cancelRequest(true);
    const createdRequest = await this.requestWaterTanker(listId);

    const canceledListName = await db
      .select({
        name: privateWaterTankerRequestListTable.name,
      })
      .from(privateWaterTankerRequestListTable)
      .where(eq(privateWaterTankerRequestListTable.id, canceledRequest.waterTankerRequestListId));
    const createdListName = await db
      .select({
        name: privateWaterTankerRequestListTable.name,
      })
      .from(privateWaterTankerRequestListTable)
      .where(eq(privateWaterTankerRequestListTable.id, createdRequest.waterTankerRequestListId));

    await db
      .update(privateWaterTankerRequestCommentsTable)
      .set({
        waterTankerRequestId: createdRequest.id,
      })
      .where(eq(privateWaterTankerRequestCommentsTable.waterTankerRequestId, canceledRequest.id));

    await db.insert(privateWaterTankerRequestCommentsTable).values({
      comment: `Se movió de la lista ${canceledListName[0].name} a la lista ${createdListName[0].name}`,
      userId: 0,
      waterTankerRequestId: createdRequest.id,
    });

    return createdRequest;
  }

  public async addComment(comment: string, requestUUID: string) {
    const waterTankerRequestTable = await db
      .select({
        id: privateWaterTankerRequestTable.id,
      })
      .from(privateWaterTankerRequestTable)
      .where(eq(privateWaterTankerRequestTable.uuid, requestUUID))
      .limit(1);

    if (!waterTankerRequestTable.length) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestId = waterTankerRequestTable[0].id;

    await db.insert(privateWaterTankerRequestCommentsTable).values({
      comment,
      userId: this.user.id,
      waterTankerRequestId,
    });
  }

  public async addTestingRequest(house: number, listId: number) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const alreadyInWaterTankerRequestView = await db
      .select()
      .from(privateWaterTankerRequestTable)
      .where(
        and(
          eq(privateWaterTankerRequestTable.userId, house),
          eq(privateWaterTankerRequestTable.isActive, true),
          eq(privateWaterTankerRequestTable.requestStatus, privateWaterTankerRequestStatusEnum.enumValues[0]),
          eq(privateWaterTankerRequestTable.isTesting, true),
        ),
      )
      .limit(1);

    if (alreadyInWaterTankerRequestView.length) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestTable = await db
      .insert(privateWaterTankerRequestTable)
      .values({
        isTesting: true,
        testerUserId: this.user.id,
        userId: house,
        waterTankerRequestListId: listId,
      })
      .returning();

    return waterTankerRequestTable[0];
  }
}
