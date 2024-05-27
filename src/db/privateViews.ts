import { and, asc, between, eq, or, sql } from 'drizzle-orm';

import { db } from '.';
import {
  privateSchema,
  privateWaterTankerRequestListTable,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
} from './privateSchema';
import { publicUsersTable } from './publicSchema';

export const privateWaterTankerRequestView = privateSchema.view('v_water_tanker_request').as(
  db
    .select({
      createdAt: privateWaterTankerRequestTable.createdAt,
      house: publicUsersTable.house,
      list: sql<string>`${privateWaterTankerRequestListTable.name}`.as('list'),
      requestStatus: privateWaterTankerRequestTable.requestStatus,
      uuid: privateWaterTankerRequestTable.uuid,
    })
    .from(privateWaterTankerRequestTable)
    .innerJoin(
      privateWaterTankerRequestListTable,
      eq(privateWaterTankerRequestTable.waterTankerRequestListId, privateWaterTankerRequestListTable.id),
    )
    .innerJoin(publicUsersTable, eq(privateWaterTankerRequestTable.userId, publicUsersTable.id))
    .where(
      and(
        eq(privateWaterTankerRequestTable.isActive, true),
        or(
          eq(privateWaterTankerRequestTable.requestStatus, privateWaterTankerRequestStatusEnum.enumValues[0]),
          between(privateWaterTankerRequestTable.updatedAt, sql`now() - interval '2 hours'`, sql`now()`),
        ),
      ),
    )
    .orderBy(asc(privateWaterTankerRequestTable.createdAt)),
);
