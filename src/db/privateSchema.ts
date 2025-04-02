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

export const privateWaterTankerTable = privateSchema.table('water_tanker', {
  ...pk,
  ...timestamps,
  description: t.text('description').notNull(),
  isActive: t.boolean('is_active').notNull().default(true),
  name: t.text('name').notNull().unique(),
});

export const privateWaterTankerRequestListEnum = privateSchema.enum('water_tanker_request_list', [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
]);

export const privateWaterTankerRequestStatusEnum = privateSchema.enum('water_tanker_request_status', [
  'pending',
  'completed',
  'cancelled',
]);

export const privateWaterTankerRequestTable = privateSchema.table('water_tanker_request', {
  ...pk,
  ...timestamps,
  isActive: t.boolean('is_active').notNull().default(true),
  isTesting: t.boolean('is_testing').notNull().default(false),
  list: privateWaterTankerRequestListEnum('list').notNull(),
  status: privateWaterTankerRequestStatusEnum('status').notNull().default('pending'),
  testerUserId: t.integer('tester_user_id').references(() => publicUsersTable.id),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
  uuid: t.uuid('uuid').defaultRandom().unique().notNull(),
  waterTankerId: t
    .integer('water_tanker_id')
    .notNull()
    .references(() => privateWaterTankerTable.id),
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

export const privateNoticesTable = privateSchema.table('notices', {
  ...pk,
  ...timestamps,
  isActive: t.boolean('is_active').notNull().default(true),
  notice: t.text('notice').notNull(),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
});
