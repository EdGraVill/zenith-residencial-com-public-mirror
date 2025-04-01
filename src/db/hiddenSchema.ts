import * as t from 'drizzle-orm/pg-core';

import {
  privateWaterTankerRequestListEnum,
  privateWaterTankerRequestStatusEnum,
  privateWaterTankerRequestTable,
} from './privateSchema';
import { publicUsersTable } from './publicSchema';

export const hiddenSchema = t.pgSchema('hidden');

export const hiddenWaterTankerRequestHRTable = hiddenSchema.table('water_tanker_request_hr', {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  id: t.serial('id').primaryKey(),
  isTesting: t.boolean('is_testing'),
  list: privateWaterTankerRequestListEnum('list'),
  status: privateWaterTankerRequestStatusEnum('status'),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
  waterTankerRequestId: t
    .integer('water_tanker_request_id')
    .notNull()
    .references(() => privateWaterTankerRequestTable.id),
});

export const hiddenAccessHRTable = hiddenSchema.table('access_hr', {
  clientUserAgent: t.jsonb('client_user_agent'),
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  id: t.serial('id').primaryKey(),
  ip: t.text('ip'),
  phone: t.text('phone'),
  userId: t.integer('user_id'),
});
