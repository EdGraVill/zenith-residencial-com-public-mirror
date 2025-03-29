import * as t from 'drizzle-orm/pg-core';

export const publicUsersTable = t.pgTable('users', {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  house: t.integer('house').notNull(),
  id: t.serial('id').primaryKey(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
