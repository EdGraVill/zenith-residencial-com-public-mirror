import * as t from 'drizzle-orm/pg-core';

import { pk, timestamps } from './common';
import { publicUsersTable } from './publicSchema';

export const privateSchema = t.pgSchema('private');

export const privateContactInformationTable = privateSchema.table('contact_information', {
  ...pk,
  ...timestamps,
  phone: t.text('phone').notNull().unique(),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
});

export const privateWaterTankerRequestStatusEnum = privateSchema.enum('water_tanker_request_status', [
  'pending',
  'completed',
  'cancelled',
]);

export const privateWaterTankerRequestListTable = privateSchema.table('water_tanker_request_list', {
  ...pk,
  ...timestamps,
  description: t.text('description').notNull(),
  name: t.text('name').notNull().unique(),
});

export const privateWaterTankerRequestListGroupEnum = privateSchema.enum('water_tanker_request_list_group', [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
]);

export const privateWaterTankerRequestTable = privateSchema.table('water_tanker_request', {
  ...pk,
  ...timestamps,
  group: privateWaterTankerRequestListGroupEnum('group').notNull(),
  isActive: t.boolean('is_active').notNull().default(true),
  isTesting: t.boolean('is_testing').notNull().default(false),
  requestStatus: privateWaterTankerRequestStatusEnum('request_status').notNull().default('pending'),
  testerUserId: t.integer('tester_user_id').references(() => publicUsersTable.id),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
  uuid: t.uuid('uuid').defaultRandom().unique().notNull(),
  waterTankerRequestListId: t
    .integer('water_tanker_request_list_id')
    .notNull()
    .references(() => privateWaterTankerRequestListTable.id),
});

export const privateWaterTankerRequestCommentsTable = privateSchema.table('water_tanker_request_comments', {
  ...pk,
  ...timestamps,
  comment: t.text('comment').notNull(),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
  waterTankerRequestId: t
    .integer('water_tanker_request_id')
    .notNull()
    .references(() => privateWaterTankerRequestTable.id),
});

export const privateAdminsTable = privateSchema.table('admins', {
  ...pk,
  ...timestamps,
  isActive: t.boolean('is_active').notNull().default(true),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
});

export const privateStreetEnum = privateSchema.enum('street', [
  'Zenith Oriente',
  'Zenith Norte',
  'Meridiano',
  'Zenith Poniente',
  'Horizonte',
  'Nadir Poniente',
  'Nadir Sur',
  'Nadir Oriente',
  'Tropico',
  'Ecuador',
]);

export const privateHouseInformationTable = privateSchema.table('house_information', {
  ...pk,
  ...timestamps,
  street: privateStreetEnum('street').notNull(),
  userId: t
    .integer('user_id')
    .notNull()
    .unique()
    .references(() => publicUsersTable.id),
});
