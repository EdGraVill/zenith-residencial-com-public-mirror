import { and, asc, between, eq, or, sql } from 'drizzle-orm';

import { db } from '.';
import {
  privateHouseInformationTable,
  privateSchema,
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestListTable,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
} from './privateSchema';
import { publicUsersTable } from './publicSchema';

interface Comment {
  author: number;
  comment: string;
  createdAt: Date;
  id: number;
}

export const privateWaterTankerRequestView = privateSchema.view('v_water_tanker_request').as(
  db
    .select({
      comments: sql<Comment[]>`coalesce(
        json_agg(
          json_build_object(
            'author', ${privateWaterTankerRequestCommentsTable.userId},
            'comment', ${privateWaterTankerRequestCommentsTable.comment},
            'createdAt', ${privateWaterTankerRequestCommentsTable.createdAt},
            'id', ${privateWaterTankerRequestCommentsTable.id}
          )
        ) filter (where water_tanker_request_comments is not null),
        '[]'::json
      )`.as('comments'),
      createdAt: privateWaterTankerRequestTable.createdAt,
      group: privateWaterTankerRequestTable.group,
      house: publicUsersTable.house,
      isTesting: privateWaterTankerRequestTable.isTesting,
      list: sql<string>`${privateWaterTankerRequestListTable.name}`.as('list'),
      requestStatus: privateWaterTankerRequestTable.requestStatus,
      street: privateHouseInformationTable.street,
      updatedAt: privateWaterTankerRequestTable.updatedAt,
      uuid: privateWaterTankerRequestTable.uuid,
    })
    .from(privateWaterTankerRequestTable)
    .innerJoin(
      privateWaterTankerRequestListTable,
      eq(privateWaterTankerRequestTable.waterTankerRequestListId, privateWaterTankerRequestListTable.id),
    )
    .innerJoin(publicUsersTable, eq(privateWaterTankerRequestTable.userId, publicUsersTable.id))
    .innerJoin(
      privateHouseInformationTable,
      eq(privateWaterTankerRequestTable.userId, privateHouseInformationTable.userId),
    )
    .leftJoin(
      privateWaterTankerRequestCommentsTable,
      eq(privateWaterTankerRequestTable.id, privateWaterTankerRequestCommentsTable.waterTankerRequestId),
    )
    .where(
      and(
        eq(privateWaterTankerRequestTable.isActive, true),
        or(
          eq(privateWaterTankerRequestTable.requestStatus, privateWaterTankerRequestStatusEnum.enumValues[0]),
          between(privateWaterTankerRequestTable.updatedAt, sql`now() - interval '15 minutes'`, sql`now()`),
        ),
      ),
    )
    .groupBy(
      privateWaterTankerRequestTable.createdAt,
      privateWaterTankerRequestTable.group,
      publicUsersTable.house,
      privateWaterTankerRequestTable.isTesting,
      privateWaterTankerRequestListTable.name,
      privateWaterTankerRequestTable.requestStatus,
      privateHouseInformationTable.street,
      privateWaterTankerRequestTable.updatedAt,
      privateWaterTankerRequestTable.uuid,
    )
    .orderBy(asc(privateWaterTankerRequestTable.createdAt)),
);
