import { and, asc, between, eq, or, sql } from 'drizzle-orm';

import { db } from '.';
import {
  privateHouseInformationTable,
  privateSchema,
  privateWaterTankerRequestCommentsTable,
  privateWaterTankerRequestListEnum,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
  privateWaterTankerTable,
} from './privateSchema';
import { publicUsersTable } from './publicSchema';
import type { List } from '@/lib/schemas';

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
        eq(privateWaterTankerTable.isActive, true),
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

export const privateBestListView = privateSchema.view('v_best_list').as(
  db
    .select({
      bestList: sql<List>`case
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[0]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[0]}
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[1]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[1]}
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[2]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[2]}
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[3]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[3]}
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[4]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[4]}
        when count(case when ${privateWaterTankerRequestTable.list} = ${privateWaterTankerRequestListEnum.enumValues[5]} THEN 1 END) < 6 then ${privateWaterTankerRequestListEnum.enumValues[5]}
        else ${privateWaterTankerRequestListEnum.enumValues[6]}
      end`.as('best_list'),
      id: privateWaterTankerRequestTable.id,
      name: privateWaterTankerTable.name,
    })
    .from(privateWaterTankerRequestTable)
    .innerJoin(privateWaterTankerTable, eq(privateWaterTankerRequestTable.waterTankerId, privateWaterTankerTable.id))
    .where(
      and(
        eq(privateWaterTankerRequestTable.isActive, true),
        eq(privateWaterTankerTable.isActive, true),
        or(
          eq(privateWaterTankerRequestTable.status, privateWaterTankerRequestStatusEnum.enumValues[0]),
          between(privateWaterTankerRequestTable.updatedAt, sql`now() - interval '6 hours'`, sql`now()`),
        ),
      ),
    )
    .groupBy(privateWaterTankerRequestTable.id, privateWaterTankerTable.name),
);
