import * as t from 'drizzle-orm/pg-core';

export const pk = {
  id: t.serial('id').primaryKey(),
};

export const timestamps = {
  createdAt: t.timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
