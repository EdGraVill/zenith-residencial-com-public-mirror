import { and, asc, between, eq, or, sql } from 'drizzle-orm';

import { db } from '.';
import {
  privateHouseInformationTable,
  privateSchema,
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
  privateWaterTankerTable,
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
      house: publicUsersTable.house,
      isTesting: privateWaterTankerRequestTable.isTesting,
      list: privateWaterTankerRequestTable.list,
      status: privateWaterTankerRequestTable.status,
      street: privateHouseInformationTable.street,
      updatedAt: privateWaterTankerRequestTable.updatedAt,
      uuid: privateWaterTankerRequestTable.uuid,
      waterTankerName: sql<string>`${privateWaterTankerTable.name}`.as('water_tanker_name'),
    })
    .from(privateWaterTankerRequestTable)
    .innerJoin(privateWaterTankerTable, eq(privateWaterTankerRequestTable.waterTankerId, privateWaterTankerTable.id))
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
          eq(privateWaterTankerRequestTable.status, privateWaterTankerRequestStatusEnum.enumValues[0]),
          between(privateWaterTankerRequestTable.updatedAt, sql`now() - interval '6 hours'`, sql`now()`),
        ),
      ),
    )
    .groupBy(
      privateWaterTankerRequestTable.createdAt,
      publicUsersTable.house,
      privateWaterTankerRequestTable.isTesting,
      privateWaterTankerRequestTable.list,
      privateWaterTankerRequestTable.status,
      privateHouseInformationTable.street,
      privateWaterTankerRequestTable.updatedAt,
      privateWaterTankerRequestTable.uuid,
      privateWaterTankerTable.name,
    )
    .orderBy(asc(privateWaterTankerRequestTable.createdAt)),
);
