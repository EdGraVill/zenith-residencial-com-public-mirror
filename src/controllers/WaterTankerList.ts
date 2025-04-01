import { and, eq } from 'drizzle-orm';
import { Entropy } from 'entropy-string';

import type User from './User';
import { db } from '@/db';
import { hiddenWaterTankerRequestHRTable } from '@/db/hiddenSchema';
import {
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestListEnum,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
  privateWaterTankerTable,
} from '@/db/privateSchema';
import { privateBestListView, privateWaterTankerRequestView } from '@/db/privateViews';
import type { List } from '@/lib/schemas';

export type WaterTankers = Record<
  string,
  {
    description: string;
    id: number;
    name: string;
    requests: Array<typeof privateWaterTankerRequestView.$inferSelect>;
  }
>;

export default class WaterTanker {
  public static async getBestList(waterTankerId: number): Promise<List> {
    const bestListView = await db
      .select()
      .from(privateBestListView)
      .where(eq(privateBestListView.id, waterTankerId))
      .limit(1);

    if (!bestListView.length) {
      return privateWaterTankerRequestListEnum.enumValues[0];
    }

    return bestListView[0].bestList;
  }

  public static async getWaterTankers(): Promise<WaterTankers> {
    const waterTankerTable = await db.select().from(privateWaterTankerTable);

    const waterTankerRequestView = await db.select().from(privateWaterTankerRequestView);
    const waterTankers: WaterTankers = waterTankerTable.reduce(
      (acc, waterTanker) => ({
        ...acc,
        [waterTanker.name]: {
          description: waterTanker.description,
          id: waterTanker.id,
          name: waterTanker.name,
          requests: waterTankerRequestView.filter((request) => request.waterTankerName === waterTanker.name),
        },
      }),
      {},
    );

    return waterTankers;
  }

  constructor(public readonly user: User) {}

  public async isAdmin() {
    return this.user.canBypass();
  }

  public async createWaterTanker(name: string, description: string) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const waterTankerTable = await db
      .insert(privateWaterTankerTable)
      .values({
        description,
        name,
      })
      .returning();

    return waterTankerTable[0];
  }

  public async updateWaterTanker(id: number, name?: string, description?: string) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    if (!name && !description) {
      throw new Error('Forbidden');
    }

    const waterTankerTable = await db
      .update(privateWaterTankerTable)
      .set({
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
      })
      .where(eq(privateWaterTankerTable.id, id))
      .returning();

    return waterTankerTable[0];
  }

  public async removeWaterTanker(id: number) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const waterTankerTableToDelete = await db
      .select()
      .from(privateWaterTankerTable)
      .where(eq(privateWaterTankerTable.id, id))
      .limit(1);

    const entropy = new Entropy();

    const waterTankerTable = await db
      .update(privateWaterTankerTable)
      .set({
        isActive: false,
        name: `deleted_${entropy.smallID()}_${waterTankerTableToDelete[0].name}`,
      })
      .where(eq(privateWaterTankerTable.id, id))
      .returning();

    return waterTankerTable[0];
  }

  public async myOpenRequest() {
    const alreadyInWaterTankerRequestView = await db
      .select()
      .from(privateWaterTankerRequestTable)
      .where(
        and(
          eq(privateWaterTankerRequestTable.userId, this.user.id),
          eq(privateWaterTankerRequestTable.isActive, true),
          eq(privateWaterTankerRequestTable.status, privateWaterTankerRequestStatusEnum.enumValues[0]),
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
          eq(privateWaterTankerRequestView.status, privateWaterTankerRequestStatusEnum.enumValues[0]),
          eq(privateWaterTankerRequestView.isTesting, false),
        ),
      )
      .limit(1);

    if (!alreadyInWaterTankerRequestView.length) {
      return null;
    }

    return alreadyInWaterTankerRequestView[0];
  }

  public async createRequest(waterTankerId: number, list: List) {
    const openRequest = await this.myOpenRequest();

    if (openRequest) {
      throw new Error('Forbidden');
    }

    const waterTankerRequestTable = await db
      .insert(privateWaterTankerRequestTable)
      .values({
        list,
        userId: this.user.id,
        waterTankerId,
      })
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      isTesting: false,
      list,
      status: privateWaterTankerRequestStatusEnum.enumValues[0],
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
        status: privateWaterTankerRequestStatusEnum.enumValues[1],
      })
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      isTesting: waterTankerRequestTable[0].isTesting,
      list: waterTankerRequestTable[0].list,
      status: privateWaterTankerRequestStatusEnum.enumValues[1],
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    return waterTankerRequestTable[0];
  }

  public async cancelRequest(wasMoved = false, requestUUID?: string) {
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
        isActive: !wasMoved,
        status: privateWaterTankerRequestStatusEnum.enumValues[2],
      })
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      isTesting: waterTankerRequestTable[0].isTesting,
      list: waterTankerRequestTable[0].list,
      status: privateWaterTankerRequestStatusEnum.enumValues[2],
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    return waterTankerRequestTable[0];
  }

  public async moveRequestToWaterTanker(waterTankerId: number, requestUUID?: string) {
    if (!this.isAdmin() && requestUUID) {
      throw new Error('Forbidden');
    }

    if (!this.isAdmin() && !requestUUID) {
      const openRequest = await this.myOpenRequest();

      if (!openRequest) {
        throw new Error('Forbidden');
      }
    }

    const canceledRequest = await this.cancelRequest(true, requestUUID);

    let createdRequest: typeof privateWaterTankerRequestTable.$inferSelect;

    const bestList = await WaterTanker.getBestList(waterTankerId);

    if (canceledRequest.isTesting) {
      createdRequest = await this.addTestingRequest(canceledRequest.userId, waterTankerId, bestList);
    } else {
      createdRequest = await this.createRequest(waterTankerId, bestList);
    }

    const canceledWaterTanker = await db
      .select({
        name: privateWaterTankerTable.name,
      })
      .from(privateWaterTankerTable)
      .where(eq(privateWaterTankerTable.id, canceledRequest.waterTankerId));

    const createdWaterTanker = await db
      .select({
        name: privateWaterTankerTable.name,
      })
      .from(privateWaterTankerTable)
      .where(eq(privateWaterTankerTable.id, createdRequest.waterTankerId));

    await db
      .update(privateWaterTankerRequestCommentsTable)
      .set({
        waterTankerRequestId: createdRequest.id,
      })
      .where(eq(privateWaterTankerRequestCommentsTable.waterTankerRequestId, canceledRequest.id));

    await db.insert(privateWaterTankerRequestCommentsTable).values({
      comment: `Se movió de la pipa ${canceledWaterTanker[0].name} a la pipa ${createdWaterTanker[0].name}`,
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

  public async addTestingRequest(house: number, waterTankerId: number, list: List) {
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
          eq(privateWaterTankerRequestTable.status, privateWaterTankerRequestStatusEnum.enumValues[0]),
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
        list,
        testerUserId: this.user.id,
        userId: house,
        waterTankerId,
      })
      .returning();

    return waterTankerRequestTable[0];
  }

  public async moveRequestToList(list: List, requestUUID?: string) {
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

    const currentTankerRequestTable = await db
      .select({
        list: privateWaterTankerRequestTable.list,
        waterTanker: privateWaterTankerTable.name,
      })
      .from(privateWaterTankerRequestTable)
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .innerJoin(privateWaterTankerTable, eq(privateWaterTankerRequestTable.waterTankerId, privateWaterTankerTable.id))
      .limit(1);

    const waterTankerRequestTable = await db
      .update(privateWaterTankerRequestTable)
      .set({
        list,
      })
      .where(eq(privateWaterTankerRequestTable.id, requestId))
      .returning();

    await db.insert(hiddenWaterTankerRequestHRTable).values({
      isTesting: waterTankerRequestTable[0].isTesting,
      list,
      status: waterTankerRequestTable[0].status,
      userId: this.user.id,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });

    await db.insert(privateWaterTankerRequestCommentsTable).values({
      comment: `Se movió de la lista ${currentTankerRequestTable[0].list} a la lista ${list} dentro de la pipa ${currentTankerRequestTable[0].waterTanker}`,
      userId: 0,
      waterTankerRequestId: waterTankerRequestTable[0].id,
    });
  }
}
