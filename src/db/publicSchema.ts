import * as t from 'drizzle-orm/pg-core';

import { pk, timestamps } from './common';

export const publicUsersTable = t.pgTable('users', {
  ...pk,
  ...timestamps,
  house: t.integer('house').notNull(),
});
