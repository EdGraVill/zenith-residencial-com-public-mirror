import * as t from 'drizzle-orm/pg-core';

import { publicUsersTable } from './publicSchema';

export const privateSchema = t.pgSchema('private');

export const privateContactInformationTable = privateSchema.table('contact_information', {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  id: t.serial('id').primaryKey(),
  phone: t.text('phone').notNull().unique(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  description: t.text('description').notNull(),
  id: t.serial('id').primaryKey(),
  name: t.text('name').notNull().unique(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const privateWaterTankerRequestTable = privateSchema.table('water_tanker_request', {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  id: t.serial('id').primaryKey(),
  isActive: t.boolean('is_active').notNull().default(true),
  requestStatus: privateWaterTankerRequestStatusEnum('request_status').notNull().default('pending'),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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

export const privateAdminsTable = privateSchema.table('admins', {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  id: t.serial('id').primaryKey(),
  isActive: t.boolean('is_active').notNull().default(true),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => publicUsersTable.id),
});
